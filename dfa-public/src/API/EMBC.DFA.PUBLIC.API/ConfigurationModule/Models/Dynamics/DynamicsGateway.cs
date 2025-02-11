using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Xml;
using EMBC.DFA.API.ConfigurationModule.Models.AuthModels;
using EMBC.DFA.API.ConfigurationModule.Models.PDF;
using EMBC.ESS.Shared.Contracts.Metadata;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Mozilla;
using Pipelines.Sockets.Unofficial.Arenas;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;
using static System.Net.Mime.MediaTypeNames;

namespace EMBC.DFA.API.ConfigurationModule.Models.Dynamics
{
    public class DynamicsGateway : IDynamicsGateway
    {
        private readonly CRMWebAPI api;

        public DynamicsGateway(CRMWebAPI api)
        {
            this.api = api;
        }

        public async Task<IEnumerable<dfa_appcontact>> GetContactsAsync()
        {
            var list = await api.GetList<dfa_appcontact>("dfa_appcontacts", new CRMGetListOptions
            {
                Select = new[] { "dfa_firstname", "dfa_lastname", "dfa_initial" }
            });

            return list.List;
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            var list = await api.GetList<Country>("era_countries", new CRMGetListOptions
            {
                Select = new[] { "era_countrycode", "era_countryid", "era_isocountrycode", "era_name" }
            });

            return list.List;
        }

        public async Task<IEnumerable<dfa_areacommunitieses>> GetCommunitiesAsync()
        {
            var list = await api.GetList<dfa_areacommunitieses>("dfa_areacommunitieses", new CRMGetListOptions
            {
                Select = new[] { "dfa_areacommunitiesid", "dfa_name", "dfa_typeofcommunity" }
            });

            return list.List;
        }

        public async Task<dfa_appcontact> GetUserProfileAsync(string userId)
        {
            try
            {
                var userObj = await api.GetList<dfa_appcontact>("dfa_appcontacts", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_firstname", "dfa_lastname", "dfa_initial",
                        "dfa_isindigenous2", "dfa_emailaddress", "dfa_cellphonenumber",
                        "dfa_residencetelephonenumber", "dfa_alternatephonenumber", "dfa_primaryaddressline1",
                        "dfa_primaryaddressline2", "dfa_primarycity", "dfa_primarypostalcode",
                        "dfa_primarystateprovince", "dfa_secondaryaddressline1", "dfa_secondaryaddressline2",
                        "dfa_secondarycity", "dfa_secondarypostalcode", "dfa_secondarystateprovince",
                        "dfa_isprimaryandsecondaryaddresssame", "dfa_appcontactid",
                        "dfa_bcservicecardid", "dfa_lastdateupdated"
                    },
                    Filter = $"dfa_bceiduserguid eq '{userId}'"
                });

                return userObj != null ? userObj.List.LastOrDefault() : null;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<string> AddContact(dfa_appcontact contact)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalCreateProfile", contact);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to add contact {ex.Message}", ex);
            }

            return string.Empty;
        }

        // TODO: fails with null dates when signatures not passed in
        public async Task<string> AddApplication(dfa_appapplicationstart_params application, temp_dfa_appapplicationstart_params temp_params)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalCreateApplication", application);

                // Update with additional values TODO: remove when dynamics process updated to include these parameters
                dynamic updateObject = new ExpandoObject();
                updateObject.dfa_isprimaryanddamagedaddresssame2 = application.dfa_isprimaryanddamagedaddresssame2;
                updateObject.dfa_damagedpropertystreet1 = application.dfa_damagedpropertystreet1;
                updateObject.dfa_damagedpropertystreet2 = application.dfa_damagedpropertystreet2;
                updateObject.dfa_damagedpropertycitytext = application.dfa_damagedpropertycitytext;
                updateObject.dfa_damagedpropertyprovince = application.dfa_damagedpropertyprovince;
                updateObject.dfa_damagedpropertypostalcode = application.dfa_damagedpropertypostalcode;
                updateObject.dfa_dateofdamage = application.dfa_dateofdamage;
                updateObject.dfa_doyourlossestotalmorethan10002 = temp_params.dfa_doyourlossestotalmorethan10002; // TODO: pass this in from dfa_applicationstart_params

                // parent event object
                var parEventIndexer = updateObject as IDictionary<string, object>;
                parEventIndexer["dfa_EventId@odata.bind"] = "/dfa_events(" + temp_params.dfa_eventid + ")";

                Guid applicationId = new Guid(result.Where(m => m.Key == "output").ToList()[0].Value.ToString());

                var updateResult = await api.Update("dfa_appapplications", applicationId, updateObject, false);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to add application {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<string> AddApplicationSignature(dfa_signature dfa_signature)
        {
            try
            {
               await api.ExecuteAction("dfa_DFAPortalAnnotationCreation", dfa_signature);
               return "signatureadded";
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to add application signature {ex.Message}", ex);
            }
        }

        public async Task<string> UpdateApplication(dfa_appapplicationmain_params application, temp_dfa_appapplicationmain_params temp_params)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAExpansionPortalAppApplication", application);
                var jsonVal = JsonConvert.SerializeObject(application);

                // Update with additional values TODO: remove when dynamics process updated to include these parameters

                //dynamic updateObject = new ExpandoObject();
                //updateObject.dfa_accountlegalname = temp_params.dfa_accountlegalname;
                //updateObject.dfa_businessmanagedbyallownersondaytodaybasis = temp_params.dfa_businessmanagedbyallownersondaytodaybasis;
                //updateObject.dfa_grossrevenues100002000000beforedisaster = temp_params.dfa_grossrevenues100002000000beforedisaster;
                //updateObject.dfa_employlessthan50employeesatanyonetime = temp_params.dfa_employlessthan50employeesatanyonetime;
                //updateObject.dfa_farmoperation = temp_params.dfa_farmoperation;
                //updateObject.dfa_ownedandoperatedbya = temp_params.dfa_ownedandoperatedbya;
                //updateObject.dfa_farmoperationderivesthatpersonsmajorincom = temp_params.dfa_farmoperationderivesthatpersonsmajorincom;

                //var updateResult = await api.Update("dfa_appapplications", application.dfa_appapplicationid, updateObject, false);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete application {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<dfa_appapplicationstart_retrieve> GetApplicationStartById(Guid applicationId)
        {
            var list = await api.GetList<dfa_appapplicationstart_retrieve>("dfa_appapplications", new CRMGetListOptions
            {
                Select = new[]
                {
                    "dfa_appapplicationid", "dfa_applicanttype", "dfa_doyouhaveinsurancecoverage2", "_dfa_applicant_value",
                    "dfa_primaryapplicantsignednoins",
                    "dfa_primaryapplicantprintnamenoins", "dfa_primaryapplicantsigneddatenoins", "dfa_secondaryapplicantsignednoins",
                    "dfa_secondaryapplicantprintnamenoins", "dfa_secondaryapplicantsigneddatenoins", "dfa_isprimaryanddamagedaddresssame2",
                    "dfa_damagedpropertystreet1", "dfa_damagedpropertystreet2", "dfa_damagedpropertycitytext", "dfa_damagedpropertyprovince",
                    "dfa_damagedpropertypostalcode", "dfa_dateofdamage", "dfa_doyourlossestotalmorethan10002", "_dfa_eventid_value",
                    "dfa_farmtype", "dfa_smallbusinesstype"
                },
                Filter = $"dfa_appapplicationid eq {applicationId}"
            });

            //list.List.FirstOrDefault().dfa_farmtype = (int)FarmOptionSet.General; // TODO: replace this with actual retrieve
            //list.List.FirstOrDefault().dfa_smallbusinesstype = (int)SmallBusinessOptionSet.General; // TODO: replace this with actual retrieve

            return list.List.FirstOrDefault();
        }

        public async Task<dfa_appapplicationmain_retrieve> GetApplicationMainById(Guid applicationId)
        {
            var list = await api.GetList<dfa_appapplicationmain_retrieve>("dfa_appapplications", new CRMGetListOptions
            {
                // TODO Update list of fields
                Select = new[]
                {
                    "dfa_appapplicationid", "dfa_isprimaryanddamagedaddresssame2", "dfa_damagedpropertystreet1", "dfa_damagedpropertystreet2",
                    "dfa_damagedpropertycitytext", "dfa_damagedpropertyprovince", "dfa_damagedpropertypostalcode", "dfa_isthispropertyyourp2",
                    "dfa_indigenousreserve2", "dfa_nameoffirstnationsr", "dfa_manufacturedhom2", "dfa_eligibleforbchomegrantonthisproperty2",
                    "_dfa_buildingownerlandlord_value",
                    "dfa_acopyofarentalagreementorlease2", "dfa_areyounowresidingintheresidence2",
                    "dfa_causeofdamageflood2", "dfa_causeofdamagestorm2", "dfa_causeofdamagelandslide2", "dfa_causeofdamageother2",
                    "dfa_causeofdamageloss", "dfa_dateofdamage", "dfa_dateofdamageto", "dfa_datereturntotheresidence",
                    "dfa_description", "dfa_doyourlossestotalmorethan10002", "dfa_haveinvoicesreceiptsforcleanuporrepairs2",
                    "dfa_primaryapplicantprintname", "dfa_primaryapplicantsigned", "dfa_primaryapplicantsigneddate",
                    "dfa_secondaryapplicantprintname", "dfa_secondaryapplicantsigned", "dfa_secondaryapplicantsigneddate",
                    "dfa_wereyouevacuatedduringtheevent2", "dfa_accountlegalname", "dfa_businessmanagedbyallownersondaytodaybasis",
                    "dfa_grossrevenues100002000000beforedisaster", "dfa_employlessthan50employeesatanyonetime",
                    "dfa_ownedandoperatedbya", "dfa_farmoperation", "dfa_farmoperationderivesthatpersonsmajorincom", "createdon", "_dfa_eventid_value",
                    "dfa_charityregistered", "dfa_charityexistsatleast12months", "dfa_charityprovidescommunitybenefit",
                    "dfa_damagedpropertyaddresscanadapostverified", "dfa_receiveguidanceassessingyourinfra", "dfa_causeofdamagewildfire2",
                    "dfa_applicantsubtype", "dfa_applicantlocalgovsubtype", "dfa_estimated", "dfa_dfaapplicantsubtypecomments", "dfa_applicantothercomments",
                    "dfa_governmentbodylegalname",
                    // 2024-09-16 EMCRI-663 waynezen; get new fields from dfa_applications table
                    "_dfa_applicant_value",
                    "dfa_doingbusinessasdbaname", "dfa_businessnumber", "dfa_businessnumberverifiedflag",
                    "dfa_incorporationnumber", "dfa_jurisdictionofincorporation", "dfa_statementofregistrationnumber", "dfa_bceidbusinessguid",
                    "dfa_businessmailingaddressline1", "dfa_businessmailingaddressline2", "dfa_businessmailingaddresscitytext",
                    "dfa_businessmailingaddressprovince", "dfa_businessmailingaddresspostalcode",
                    "dfa_mailingaddresscanadapostverified", "dfa_toreceivesupportaccessingdamage"
                },
                Filter = $"dfa_appapplicationid eq {applicationId}"
            });

            foreach (dfa_appapplicationmain_retrieve application in list.List)
            {
                if (application._dfa_buildingownerlandlord_value != null)
                {
                    var buildingOwnerlist = await api.GetList<dfa_appbuildingownerlandlord>("dfa_appbuildingownerlandlords", new CRMGetListOptions
                    {
                        Select = new[]
                        {
                            "dfa_contactlastname", "dfa_contactphone1", "dfa_contactemail", "dfa_contactfirstname"
                        },
                        Filter = $"dfa_appbuildingownerlandlordid eq {application._dfa_buildingownerlandlord_value}"
                    });

                    application.dfa_contactfirstname = buildingOwnerlist.List.Last().dfa_contactfirstname;
                    application.dfa_contactlastname = buildingOwnerlist.List.Last().dfa_contactlastname;
                    application.dfa_contactphone1 = buildingOwnerlist.List.Last().dfa_contactphone1;
                    application.dfa_contactemail = buildingOwnerlist.List.Last().dfa_contactemail;
                }

                var annotationList = await api.GetList<Annotation>("annotations", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "annotationid", "documentbody", "subject"
                    },
                    Filter = $"_objectid_value eq {application.dfa_appapplicationid}"
                });

                foreach (Annotation annotation in annotationList.List)
                {
                    if (annotation.subject == "primaryApplicantSignature")
                    {
                        application.dfa_primaryapplicantsignature = annotation.documentbody;
                    }
                    else if (annotation.subject == "secondaryApplicantSignature")
                    {
                        application.dfa_secondaryapplicantsignature = annotation.documentbody;
                    }
                }

                if (application._dfa_eventid_value != null)
                {
                    var eventlist = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                    {
                        Select = new[]
                        {
                            "dfa_eventid", "dfa_90daydeadlinenew"
                        },
                        Filter = $"dfa_eventid eq {application._dfa_eventid_value}"
                    });

                    application.dfa_90daydeadline = eventlist.List.Last()?.dfa_90daydeadlinenew;
                }
            }

            return list.List.FirstOrDefault();
        }

        /// <summary>
        /// 2024-09-20 EMCRI-676 waynezen; overloaded method that filters application based on BCeID Org
        /// </summary>
        /// <param name="bceidUser">Credentials for current logged in user</param>
        /// <returns>list of Applications that are in the logged in users Organization</returns>
        /// <exception cref="Exception">Exception may be thrown in case of Dynamics error</exception>
        public async Task<IEnumerable<dfa_appapplication>> GetApplicationListAsync(BceidUserData bceidUser)
        {
            try
            {
                var lstEvents = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_eventid", "dfa_id", "dfa_eventname", "dfa_eventtype"
                    }
                });

                var lstCases = await api.GetList<dfa_incident>("incidents", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "incidentid", "ticketnumber", "dfa_datefileclosed"
                    }
                });

                // old logic: filter on user, or new logic: filter on bceid businessguid
                var orgFilter = (bceidUser.bceid_business_guid != Guid.Empty) ?
                    $"dfa_bceidbusinessguid eq {bceidUser.bceid_business_guid.ToString()}" :
                    $"_dfa_bceiduser_value eq {bceidUser.bceid_user_guid.ToString()}";

                var list = await api.GetList<dfa_appapplication>("dfa_appapplications", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_appapplicationid", "dfa_applicanttype",
                        "dfa_dateofdamage", "dfa_damagedpropertystreet1", "dfa_damagedpropertycitytext",
                        "_dfa_eventid_value", "_dfa_casecreatedid_value", "dfa_primaryapplicantsigneddate", "createdon",
                        "dfa_applicationstatusportal", "dfa_causeofdamageflood2", "dfa_causeofdamagestorm2",
                        "dfa_causeofdamagewildfire2", "dfa_causeofdamagelandslide2", "dfa_causeofdamageloss",
                        "dfa_causeofdamageother2", "dfa_receiveguidanceassessingyourinfra", "dfa_dateofdamageto",
                        "dfa_applicationcasebpfstages", "dfa_applicationcasebpfsubstages", "dfa_bpfcloseddate"
                    },
                    Filter = $"{orgFilter} and dfa_createdonportal eq true"

                    //Expand = new CRMExpandOptions[]
                    //{
                    //    new CRMExpandOptions()
                    //    {
                    //        Property = "_dfa_eventid_value",
                    //        Select = new string[] { "dfa_eventid", "dfa_id" }
                    //    }
                    //}
                });

                //where objAppEvent != null && (objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.Public).ToString()
                //                 || objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.PrivatePublic).ToString())
                var lstApps = (from objApp in list.List
                               join objEvent in lstEvents.List.DefaultIfEmpty() on objApp._dfa_eventid_value equals objEvent.dfa_eventid into appEvent
                               from objAppEvent in appEvent.DefaultIfEmpty()
                               join objCase in lstCases.List on objApp._dfa_casecreatedid_value equals objCase.incidentid into appCase
                               from objCaseEvent in appCase.DefaultIfEmpty()
                               select new dfa_appapplication
                               {
                                   dfa_appapplicationid = objApp.dfa_appapplicationid,
                                   dfa_applicanttype = objApp.dfa_applicanttype,
                                   dfa_dateofdamage = objApp.dfa_dateofdamage,
                                   dfa_damagedpropertystreet1 = objApp.dfa_damagedpropertystreet1,
                                   dfa_damagedpropertycitytext = objApp.dfa_damagedpropertycitytext,
                                   dfa_event = objAppEvent != null ? objAppEvent.dfa_eventname : null,
                                   dfa_casenumber = objCaseEvent != null ? objCaseEvent.ticketnumber : null,
                                   dfa_primaryapplicantsigneddate = objApp.dfa_primaryapplicantsigneddate,
                                   dfa_datefileclosed = objApp.dfa_bpfcloseddate,
                                   dfa_applicationstatusportal = objApp.dfa_applicationstatusportal,
                                   createdon = objApp.createdon,
                                   dfa_causeofdamageflood2 = objApp.dfa_causeofdamageflood2,
                                   dfa_causeofdamagelandslide2 = objApp.dfa_causeofdamagelandslide2,
                                   dfa_causeofdamageloss = objApp.dfa_causeofdamageloss,
                                   dfa_causeofdamageother2 = objApp.dfa_causeofdamageother2,
                                   dfa_causeofdamagestorm2 = objApp.dfa_causeofdamagestorm2,
                                   dfa_causeofdamagewildfire2 = objApp.dfa_causeofdamagewildfire2,
                                   dfa_receiveguidanceassessingyourinfra = objApp.dfa_receiveguidanceassessingyourinfra,
                                   dfa_applicationcasebpfstages = objApp.dfa_applicationcasebpfstages,
                                   dfa_applicationcasebpfsubstages = objApp.dfa_applicationcasebpfsubstages,
                                   dfa_bpfcloseddate = !string.IsNullOrEmpty(objApp.dfa_bpfcloseddate) ? DateTime.Parse(objApp.dfa_bpfcloseddate).ToLocalTime().ToString() : objApp.dfa_bpfcloseddate,
                               }).AsEnumerable().OrderByDescending(m => DateTime.Parse(m.createdon));

                //from objEvent in lstEvents.List
                //            where objEvent.dfa_eventid == objApp._dfa_eventid_value
                //            from objCase in lstCases.List
                //            where objCase.incidentid == objApp._dfa_casecreatedid_value into reslist
                //            from p in ps_jointable.DefaultIfEmpty()
                //            select new dfa_appapplication
                //            {
                //                dfa_appapplicationid = objApp.dfa_appapplicationid,
                //                dfa_applicanttype = objApp.dfa_applicanttype,
                //                dfa_dateofdamage = objApp.dfa_dateofdamage,
                //                dfa_damagedpropertystreet1 = objApp.dfa_damagedpropertystreet1,
                //                dfa_damagedpropertycitytext = objApp.dfa_damagedpropertycitytext,
                //                dfa_event = objEvent.dfa_id,
                //                dfa_casenumber = objCase.ticketnumber
                //            }).AsEnumerable();

                return lstApps;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<dfa_appapplication> GetApplicationDetailsAsync(string appId)
        {
            try
            {
                var lstEvents = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_eventid", "dfa_id", "dfa_eventname", "dfa_eventtype"
                    }
                });

                var lstCases = await api.GetList<dfa_incident>("incidents", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "incidentid", "ticketnumber", "dfa_datefileclosed"
                    }
                });

                var list = await api.GetList<dfa_appapplication>("dfa_appapplications", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_appapplicationid", "dfa_applicanttype",
                        "dfa_dateofdamage", "dfa_damagedpropertystreet1", "dfa_damagedpropertycitytext",
                        "_dfa_eventid_value", "_dfa_casecreatedid_value", "dfa_primaryapplicantsigneddate", "createdon",
                        "dfa_applicationstatusportal", "dfa_causeofdamageflood2", "dfa_causeofdamagestorm2",
                        "dfa_causeofdamagewildfire2", "dfa_causeofdamagelandslide2", "dfa_causeofdamageloss",
                        "dfa_causeofdamageother2", "dfa_receiveguidanceassessingyourinfra", "dfa_dateofdamageto",
                        "dfa_eligiblegst"
                    },
                    Filter = $"dfa_appapplicationid eq {appId}"
                });

                //where objAppEvent != null && (objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.Public).ToString()
                //                 || objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.PrivatePublic).ToString())
                var lstApps = (from objApp in list.List
                               join objEvent in lstEvents.List.DefaultIfEmpty() on objApp._dfa_eventid_value equals objEvent.dfa_eventid into appEvent
                               from objAppEvent in appEvent.DefaultIfEmpty()
                               join objCase in lstCases.List on objApp._dfa_casecreatedid_value equals objCase.incidentid into appCase
                               from objCaseEvent in appCase.DefaultIfEmpty()
                               select new dfa_appapplication
                               {
                                   dfa_appapplicationid = objApp.dfa_appapplicationid,
                                   dfa_applicanttype = objApp.dfa_applicanttype,
                                   dfa_dateofdamage = objApp.dfa_dateofdamage,
                                   dfa_dateofdamageto = objApp.dfa_dateofdamageto,
                                   dfa_damagedpropertystreet1 = objApp.dfa_damagedpropertystreet1,
                                   dfa_damagedpropertycitytext = objApp.dfa_damagedpropertycitytext,
                                   //dfa_event = objAppEvent != null ? objAppEvent.dfa_eventname : null,
                                   dfa_casenumber = objCaseEvent != null ? objCaseEvent.ticketnumber : null,
                                   dfa_primaryapplicantsigneddate = objApp.dfa_primaryapplicantsigneddate,
                                   dfa_datefileclosed = objCaseEvent != null ? objCaseEvent.dfa_datefileclosed : null,
                                   dfa_applicationstatusportal = objApp.dfa_applicationstatusportal,
                                   createdon = objApp.createdon,
                                   dfa_causeofdamageflood2 = objApp.dfa_causeofdamageflood2,
                                   dfa_causeofdamagelandslide2 = objApp.dfa_causeofdamagelandslide2,
                                   dfa_causeofdamageloss = objApp.dfa_causeofdamageloss,
                                   dfa_causeofdamageother2 = objApp.dfa_causeofdamageother2,
                                   dfa_causeofdamagestorm2 = objApp.dfa_causeofdamagestorm2,
                                   dfa_causeofdamagewildfire2 = objApp.dfa_causeofdamagewildfire2,
                                   dfa_receiveguidanceassessingyourinfra = objApp.dfa_receiveguidanceassessingyourinfra,
                                   dfa_eligiblegst = objApp.dfa_eligiblegst
                               }).AsEnumerable().OrderByDescending(m => DateTime.Parse(m.createdon));

                return lstApps.FirstOrDefault();
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertDeleteDamagedItemAsync(dfa_appdamageditems_params objDamagedItems)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalCreateAppDamagedItem", objDamagedItems);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete/insert damaged items {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_appdamageditems_retrieve>> GetDamagedItemsListAsync(Guid applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_appdamageditems_retrieve>("dfa_appdamageditems", new CRMGetListOptions
                {
                    Select = new[] { "_dfa_applicationid_value", "dfa_appdamageditemid", "dfa_roomname", "dfa_damagedescription" },
                    Filter = $"_dfa_applicationid_value eq {applicationId}"
                });

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get damaged items {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertDeleteSecondaryApplicantAsync(dfa_appsecondaryapplicant_params objSecondaryApplicant)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalAppSecondaryApplicant", objSecondaryApplicant);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/insert/delete secondary applicant {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_appsecondaryapplicant_retrieve>> GetSecondaryApplicantsListAsync(Guid applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_appsecondaryapplicant_retrieve>("dfa_appsecondaryapplicants", new CRMGetListOptions // TODO by application Id
                {
                    Select = new[]
                    {
                        "_dfa_appapplicationid_value", "dfa_appsecondaryapplicantid", "dfa_applicanttype", "dfa_emailaddress",
                        "dfa_firstname", "dfa_lastname", "dfa_phonenumber"
                    },
                    Filter = $"_dfa_appapplicationid_value eq {applicationId}"
                });

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get secondary applicants {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertDeleteOtherContactAsync(dfa_appothercontact_params objOtherContact)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalOtherContact", objOtherContact);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/insert/delete other contact {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_appothercontact_retrieve>> GetOtherContactsListAsync(Guid applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_appothercontact_retrieve>("dfa_appothercontacts", new CRMGetListOptions // TODO by applciation id
                {
                    Select = new[]
                    {
                        "_dfa_appapplicationid_value", "dfa_appothercontactid", "dfa_emailaddress", "dfa_firstname",
                        "dfa_lastname", "dfa_phonenumber", "dfa_name", "dfa_jobtitle", "dfa_cellphone",
                        "dfa_notes"
                    },
                    Filter = $"_dfa_appapplicationid_value eq {applicationId}"
                });

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get other contacts {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertDeleteFullTimeOccupantAsync(dfa_appoccupant_params objAppOccupant)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalAppOccupant", objAppOccupant);
                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/insert/delete full time occupant {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_appoccupant_retrieve>> GetFullTimeOccupantsListAsync(Guid applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_appoccupant_retrieve>("dfa_appoccupants", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "_dfa_applicationid_value", "dfa_appoccupantid", "_dfa_contactid_value", "dfa_name", "dfa_relationshiptoapplicant"
                    },
                    Filter = $"_dfa_applicationid_value eq {applicationId}"
                });

                foreach (dfa_appoccupant_retrieve item in list.List)
                {
                    var contactList = await api.GetList<dfa_appcontact_extended>("dfa_appcontacts", new CRMGetListOptions
                    {
                        Select = new[]
                        {
                            "dfa_appcontactid", "dfa_firstname", "dfa_lastname", "dfa_title"
                        },
                        Filter = $"dfa_appcontactid eq {item._dfa_contactid_value}"
                    });

                    if (contactList != null)
                    {
                        item.dfa_firstname = contactList.List.Last().dfa_firstname;
                        item.dfa_lastname = contactList.List.Last().dfa_lastname;
                        if (item.dfa_relationshiptoapplicant == null)
                        {
                            item.dfa_relationshiptoapplicant = contactList.List.Last().dfa_title;
                        }
                    }
                }

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get full time occupants {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertDeleteCleanUpLogItemAsync(dfa_appcleanuplogs_params objCleanUpLog)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAPortalCreateAppCleanupLog", objCleanUpLog);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
              throw new Exception($"Failed to update/insert/delete clean up log item {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_appcleanuplogs_retrieve>> GetCleanUpLogItemsListAsync(Guid applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_appcleanuplogs_retrieve>("dfa_appcleanuplogs", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "_dfa_applicationid_value", "dfa_appcleanuplogid", "dfa_name", "dfa_date", "dfa_hoursworked", "_dfa_contactid_value"
                    },
                    Filter = $"_dfa_applicationid_value eq {applicationId}"
                });

                foreach (var item in list.List)
                {
                    item.dfa_description = item.dfa_name; // name from cleanup logs entity is description of work
                    if (item._dfa_contactid_value != null)
                    {
                        var contactList = await api.GetList<dfa_appcontact_extended>("dfa_appcontacts", new CRMGetListOptions
                        {
                            Select = new[]
                            {
                            "dfa_name"
                            },
                            Filter = $"dfa_appcontactid eq {item._dfa_contactid_value}"
                        });

                        if (contactList != null)
                        {
                            item.dfa_name = contactList.List.Last().dfa_name;
                        }
                    }
                }

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get clean up log items {ex.Message}", ex);
            }
        }

        public async Task<string> DeleteDocumentLocationAsync(dfa_DFAActionDeleteDocuments_parms dfa_DFAActionDeleteDocuments_parms)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_DFAActionDeleteDocuments", dfa_DFAActionDeleteDocuments_parms);

                if (result != null)
                {
                    return result.Where(m => m.Key == "RetCode") != null ? result.Where(m => m.Key == "RetCode").ToList()[0].Value.ToString() : string.Empty;
                }
                return "Deleted";
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to insert/delete document {ex.Message}", ex);
            }
        }

        public async Task<string> InsertDocumentLocationAsync(SubmissionEntity submission)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_SubmitDFADocuments", submission);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value?.ToString() : string.Empty;
                }
                return "Submitted";
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to insert/delete document {ex.Message}", ex);
            }
        }

        public async Task<string> InsertDocumentLocationClaimAsync(SubmissionEntityClaim submission)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_SubmitDFADocuments", submission);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value?.ToString() : string.Empty;
                }
                return "Submitted";
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to insert/delete document {ex.Message}", ex);
            }
        }
        public async Task<string> InsertDocumentLocationApplicationPDFAsync(SubmissionEntityPDF submission)
        {
            try
            {
                var result = await api.ExecuteAction("dfa_SubmitDFADocuments", submission);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value?.ToString() : string.Empty;
                }
                return "Submitted";
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to insert/delete document {ex.Message}", ex);
            }
        }
        public async Task<IEnumerable<dfa_projectdocumentlocation>> GetProjectDocumentLocationsListAsync(Guid projectId)
        {
            try
            {
                var projectIdString = projectId.ToString();
                var list = await api.GetList<dfa_projectdocumentlocation>("dfa_projectdocumentlocations", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_projectdocumentlocationid", "_dfa_projectid_value", "dfa_name", "dfa_description", "createdon", "dfa_documenttype", "dfa_modifiedby", "dfa_requireddocumenttype"
                    }, Filter = $"_dfa_projectid_value eq {projectIdString}"
                });

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get documents {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<dfa_projectclaimdocumentlocation>> GetProjectClaimDocumentLocationsListAsync(Guid claimId)
        {
            try
            {
                var claimIdString = claimId.ToString();
                var list = await api.GetList<dfa_projectclaimdocumentlocation>("dfa_projectclaimdocumentlocations", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_projectclaimdocumentlocationid", "_dfa_projectclaimid_value", "dfa_name", "dfa_description", "createdon", "dfa_documenttype", "dfa_modifiedby", "dfa_requireddocumenttype"
                    },
                    Filter = $"_dfa_projectclaimid_value eq {claimIdString}"
                });

                return list.List;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to get documents {ex.Message}", ex);
            }
        }

        public async Task<int> GetEventCount()
        {
            try
            {
                // TODO: when new event name field is added, retrieve the new field
                var lstEvents = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_eventid", "dfa_id", "statuscode", "dfa_90daydeadlinenew", "dfa_eventtype"
                    }
                });

                if (lstEvents.List.Where(m => m.statuscode == "1").Count() > 0)
                {
                    var lstActiveEvents = lstEvents.List.Where(m => m.statuscode == "1"
                                            && (m.dfa_eventtype == Convert.ToInt32(EventType.Public).ToString()
                                                || m.dfa_eventtype == Convert.ToInt32(EventType.PrivatePublic).ToString())).ToList();

                    var deadline90days = lstActiveEvents.Where(m => m.dfa_90daydeadlinenew != null && Convert.ToDateTime(m.dfa_90daydeadlinenew) >= DateTime.Now).Count();
                    if (deadline90days > 0)
                    {
                        return deadline90days;
                    }
                }

                return 0;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<dfa_event>> GetOpenPublicEventList()
        {
            try
            {
                var lstEvents = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_eventid", "dfa_id", "statuscode", "dfa_startdate", "dfa_enddate", "dfa_90daydeadlinenew", "dfa_eventname", "dfa_eventtype"
                    }
                });

                var nowDate = DateTime.Now;
                // open events are those active events where the 90 day deadline is now or in the future
                return lstEvents.List.Where(m => m.dfa_90daydeadlinenew != null
                    && Convert.ToDateTime(m.dfa_90daydeadlinenew) >= nowDate
                    && m.statuscode == "1"
                    && (m.dfa_eventtype == Convert.ToInt32(EventType.Public).ToString()
                                                || m.dfa_eventtype == Convert.ToInt32(EventType.PrivatePublic).ToString()));
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<dfa_effectedregioncommunities>> GetEffectedRegionCommunitiesList()
        {
            var lstEffectedRegionCommunties = await api.GetList<dfa_effectedregioncommunities>("dfa_effectedregioncommunities", new CRMGetListOptions
            {
                Select = new[]
                {
                        "dfa_effectedregioncommunityid", "_dfa_regionid_value", "dfa_areaname",
                        "_dfa_eventid_value"
                }
            });
            var lstRegions = await api.GetList<dfa_region>("dfa_regions", new CRMGetListOptions
            {
                Select = new[]
                {
                        "dfa_regionid", "dfa_name"
                }
            });

            foreach (dfa_effectedregioncommunities dfa_effectedregioncommunity in lstEffectedRegionCommunties.List)
            {
                if (dfa_effectedregioncommunity._dfa_regionid_value != null)
                {
                    dfa_effectedregioncommunity.dfa_name = lstRegions.List.Find(x => x.dfa_regionid == dfa_effectedregioncommunity._dfa_regionid_value)?.dfa_name;
                }
            }

            return lstEffectedRegionCommunties.List;
        }

        public async Task<string> UpsertProject(dfa_project_params project)
        {
            try
            {
                var jsonVal = JsonConvert.SerializeObject(project);
                var result = await api.ExecuteAction("dfa_DFAPortalCreateProject", project);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete project {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<dfa_projectmain_retrieve> GetProjectMainById(Guid projectId)
        {
            var list = await api.GetList<dfa_projectmain_retrieve>("dfa_projects", new CRMGetListOptions
            {
                // TODO Update list of fields
                Select = new[]
                {
                    "dfa_projectnumber", "dfa_projectname", "dfa_dateofdamagesameasapplication",
                    "dfa_dateofdamageto", "dfa_dateofdamagefrom",
                    "dfa_sitelocation", "dfa_descriptionofdamagedinfrastructure", "dfa_descriptionofdamagewithmaterial",
                    "dfa_descriptionofmaterialneededtorepair",
                    "dfa_descriptionofrepairwork", "dfa_descriptionofthecauseofdamage",
                    "dfa_projectbusinessprocessstages",
                    "dfa_estimatedcompletiondateofproject",
                    "dfa_estimatedcost", "dfa_dateofdamagedifferencereason",
                    "dfa_projectid", "dfa_projectbusinessprocesssubstages",
                    "dfa_descriptionofdamage", "dfa_projectapproveddate", "dfa_18monthdeadline",
                    "dfa_approvedcost", "dfa_approvedamendedprojectcost", "dfa_claimtotal", "dfa_approvedtotal","dfa_paidprojectamount","dfa_emcrapprovalcomments", "dfa_projectdecision"

                },
                Filter = $"dfa_projectid eq {projectId}"
            });

            return list.List.FirstOrDefault();
        }

        public async Task<IEnumerable<dfa_project>> GetProjectListAsync(string applicationId)
        {
            try
            {
                var list = await api.GetList<dfa_project>("dfa_projects", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_projectnumber", "dfa_projectname",
                        "dfa_sitelocation",
                        "dfa_estimatedcompletiondateofproject",
                        "dfa_approvedcost", "dfa_18monthdeadline", "statuscode",
                        "dfa_projectid", "createdon", "dfa_projectbusinessprocessstages",
                        "dfa_projectbusinessprocesssubstages", "dfa_bpfclosedate", "dfa_projectdecision"
                    },
                    Filter = $"_dfa_applicationid_value eq {applicationId}"
                });

                foreach (dfa_project project in list.List)
                {
                    var lstAmendment = await api.GetList<dfa_projectamendment>("dfa_projectamendments", new CRMGetListOptions
                    {
                        Select = new[]
                        {
                            "dfa_projectamendmentid", "_dfa_project_value"
                        },
                        Filter = $"_dfa_project_value eq {project.dfa_projectid}"
                    });

                    if (lstAmendment.List.Count() > 0)
                    {
                        project.hasAmendments = true;
                    }
                    else
                    {
                        project.hasAmendments = false;
                    }
                }

                var lstApps = (from objApp in list.List
                               select new dfa_project
                               {
                                   dfa_projectid = objApp.dfa_projectid,
                                   dfa_projectnumber = objApp.dfa_projectnumber,
                                   dfa_projectname = objApp.dfa_projectname,
                                   dfa_sitelocation = objApp.dfa_sitelocation,
                                   dfa_estimatedcompletiondateofproject = objApp.dfa_estimatedcompletiondateofproject,
                                   //dfa_event = objAppEvent != null ? objAppEvent.dfa_eventname : null,
                                   dfa_approvedcost = objApp.dfa_approvedcost.HasValue ? Math.Round(objApp.dfa_approvedcost.Value, 2) : objApp.dfa_approvedcost,
                                   dfa_18monthdeadline = objApp.dfa_18monthdeadline,
                                   createdon = objApp.createdon,
                                   statuscode = objApp.statuscode,
                                   hasAmendments = objApp.hasAmendments,
                                   dfa_projectbusinessprocessstages = objApp.dfa_projectbusinessprocessstages,
                                   dfa_projectbusinessprocesssubstages = objApp.dfa_projectbusinessprocesssubstages,
                                   dfa_projectdecision = objApp.dfa_projectdecision,
                                   dfa_bpfclosedate = !string.IsNullOrEmpty(objApp.dfa_bpfclosedate) ? DateTime.Parse(objApp.dfa_bpfclosedate).ToLocalTime().ToString() : objApp.dfa_bpfclosedate,
                               }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstApps;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<dfa_projectamendment>> GetProjectAmendmentListAsync(string projectId)
        {
            try
            {
                var lstAmendment = await api.GetList<dfa_projectamendment>("dfa_projectamendments", new CRMGetListOptions
                {
                    Select = new[]
                        {
                            "dfa_projectamendmentid", "_dfa_project_value", "createdon",
                            "dfa_additionalprojectcostdecision",
                            "dfa_amendmentnumber",
                            "dfa_amendmentreason",
                            "dfa_approvedadditionalprojectcost",
                            "dfa_deadlineextensionapproved",
                            "dfa_emcrapprovalcomments",
                            "dfa_estimatedadditionalprojectcost",
                            "dfa_requestforadditionalprojectcost",
                            "dfa_requestforprojectdeadlineextension",
                            "dfa_amendedprojectdeadlinedate",
                            "dfa_amended18monthdeadline",
                            "dfa_amendmentapproveddate",
                            "dfa_amendmentreceiveddate",
                            "dfa_amendmentstages",
                            "dfa_amendmentsubstages",
                            "dfa_projectamendmentid",
                            "dfa_amendmentdecision"
                        },
                    Filter = $"_dfa_project_value eq {projectId}"
                    //Filter = $"_dfa_project_value eq 25fff2cb-a15b-4c94-bd94-c9107e8b383a"
                });

                var lstPrjAmnds = (from objApp in lstAmendment.List
                               select new dfa_projectamendment
                               {
                                   createdon = objApp.createdon,
                                   _dfa_project_value = objApp._dfa_project_value,
                                   dfa_projectamendmentid = objApp.dfa_projectamendmentid,
                                   dfa_additionalprojectcostdecision = objApp.dfa_additionalprojectcostdecision,
                                   dfa_amendmentstages = objApp.dfa_amendmentstages,
                                   dfa_amendmentsubstages = objApp.dfa_amendmentsubstages,
                                   dfa_amendmentnumber = objApp.dfa_amendmentnumber,
                                   dfa_amendmentreason = objApp.dfa_amendmentreason,
                                   dfa_approvedadditionalprojectcost = objApp.dfa_approvedadditionalprojectcost,
                                   dfa_deadlineextensionapproved = objApp.dfa_deadlineextensionapproved,
                                   dfa_emcrapprovalcomments = objApp.dfa_emcrapprovalcomments,
                                   dfa_estimatedadditionalprojectcost = objApp.dfa_estimatedadditionalprojectcost,
                                   dfa_requestforadditionalprojectcost = objApp.dfa_requestforadditionalprojectcost,
                                   dfa_requestforprojectdeadlineextension = objApp.dfa_requestforprojectdeadlineextension,
                                   dfa_amendedprojectdeadlinedate = !string.IsNullOrEmpty(objApp.dfa_amendedprojectdeadlinedate) ? DateTime.Parse(objApp.dfa_amendedprojectdeadlinedate).ToLocalTime().ToString() : objApp.dfa_amendedprojectdeadlinedate,
                                   dfa_amended18monthdeadline = !string.IsNullOrEmpty(objApp.dfa_amended18monthdeadline) ? DateTime.Parse(objApp.dfa_amended18monthdeadline).ToLocalTime().ToString() : objApp.dfa_amended18monthdeadline,
                                   dfa_amendmentapproveddate = !string.IsNullOrEmpty(objApp.dfa_amendmentapproveddate) ? DateTime.Parse(objApp.dfa_amendmentapproveddate).ToLocalTime().ToString() : objApp.dfa_amendmentapproveddate,
                                   dfa_amendmentreceiveddate = !string.IsNullOrEmpty(objApp.dfa_amendmentreceiveddate) ? DateTime.Parse(objApp.dfa_amendmentreceiveddate).ToLocalTime().ToString() : objApp.dfa_amendmentreceiveddate,
                                   dfa_amendmentdecision = objApp.dfa_amendmentdecision,
                               }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstPrjAmnds;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<dfa_project> GetProjectDetailsAsync(string projectId)
        {
            try
            {
                var list = await api.GetList<dfa_project>("dfa_projects", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_projectnumber", "dfa_projectname",
                        "dfa_sitelocation",
                        "dfa_estimatedcompletiondateofproject",
                        "dfa_approvedcost", "dfa_18monthdeadline", "statuscode",
                        "dfa_projectid", "createdon", "dfa_projectbusinessprocessstages",
                        "dfa_projectbusinessprocesssubstages"
                    },
                    Filter = $"dfa_projectid eq {projectId}"
                });

                var lstApps = (from objApp in list.List
                               select new dfa_project
                               {
                                   dfa_projectid = objApp.dfa_projectid,
                                   dfa_projectnumber = objApp.dfa_projectnumber,
                                   dfa_projectname = objApp.dfa_projectname,
                                   dfa_sitelocation = objApp.dfa_sitelocation,
                                   dfa_18monthdeadline = objApp.dfa_18monthdeadline,
                               }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstApps.FirstOrDefault();
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<IEnumerable<dfa_projectclaim>> GetClaimListAsync(string projectId)
        {
            try
            {
                //var lstEvents = await api.GetList<dfa_event>("dfa_events", new CRMGetListOptions
                //{
                //    Select = new[]
                //    {
                //        "dfa_eventid", "dfa_id", "dfa_eventname", "dfa_eventtype"
                //    }
                //});

                var list = await api.GetList<dfa_projectclaim>("dfa_projectclaims", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_name", "dfa_claimreceivedbyemcrdate",
                        "dfa_isfirstclaim",
                        "dfa_finalclaim",
                        "dfa_totaloftotaleligible", "dfa_totalapproved", "dfa_lessfirst1000",
                        "dfa_totalpaid", "dfa_claimpaiddate", "dfa_projectclaimid",
                        "dfa_claimbpfstages", "dfa_claimbpfsubstages", "dfa_claimtotal",
                        "createdon", "dfa_costsharing", "dfa_eligiblepayable",
                        "dfa_bpfclosedate", "dfa_onetimedeductionamount",
                        "dfa_paidclaimamount",  "dfa_decisioncopy"
                    },
                    Filter = $"_dfa_recoveryplanid_value eq {projectId}"
                });

                //where objAppEvent != null && (objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.Public).ToString()
                //                 || objAppEvent.dfa_eventtype == Convert.ToInt32(EventType.PrivatePublic).ToString())
                var lstClaims = (from objClaim in list.List
                               select new dfa_projectclaim
                               {
                                   dfa_name = objClaim.dfa_name,
                                   dfa_claimreceivedbyemcrdate = objClaim.dfa_claimreceivedbyemcrdate,
                                   dfa_isfirstclaim = objClaim.dfa_isfirstclaim,
                                   dfa_finalclaim = objClaim.dfa_finalclaim,
                                   dfa_totaloftotaleligible = objClaim.dfa_totaloftotaleligible,
                                   dfa_totalapproved = objClaim.dfa_totalapproved,
                                   dfa_lessfirst1000 = objClaim.dfa_lessfirst1000,
                                   dfa_totalpaid = objClaim.dfa_totalpaid,
                                   dfa_claimpaiddate = objClaim.dfa_claimpaiddate,
                                   dfa_projectclaimid = objClaim.dfa_projectclaimid,
                                   dfa_claimbpfstages = objClaim.dfa_claimbpfstages,
                                   dfa_claimbpfsubstages = objClaim.dfa_claimbpfsubstages,
                                   dfa_claimtotal = objClaim.dfa_claimtotal,
                                   createdon = objClaim.createdon,
                                   dfa_costsharing = objClaim.dfa_costsharing,
                                   dfa_eligiblepayable = objClaim.dfa_eligiblepayable,
                                   dfa_bpfclosedate = !string.IsNullOrEmpty(objClaim.dfa_bpfclosedate) ? DateTime.Parse(objClaim.dfa_bpfclosedate).ToLocalTime().ToString() : objClaim.dfa_bpfclosedate,
                                   dfa_onetimedeductionamount = objClaim.dfa_onetimedeductionamount,
                                   dfa_paidclaimamount = objClaim.dfa_paidclaimamount,
                                   dfa_decisioncopy = objClaim.dfa_decisioncopy
                               }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstClaims;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertClaim(dfa_claim_params claim)
        {
            try
            {
                var jsonVal = JsonConvert.SerializeObject(claim);

                //var lstClaims = await GetClaimListAsync(claim.dfa_recoveryplanid);

                //if (lstClaims != null && lstClaims.Count() == 0)
                //{
                //    //claim.dfa_firstclaim = true
                //}

                var result = await api.ExecuteAction("dfa_DFAPortalCreateRecoveryClaim", claim);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete claim {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<dfa_claim_retrieve> GetClaimDetailsAsync(string claimId)
        {
            try
            {
                var list = await api.GetList<dfa_claim_retrieve>("dfa_projectclaims", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_name", "dfa_projectclaimid", "dfa_isfirstclaim",
                        "dfa_finalclaim", "createdon", "dfa_claimreceivedbyemcrdate",
                        "dfa_totaleligiblegst", "dfa_totaloftotaleligible", "dfa_totalapproved", "dfa_lessfirst1000",
                        "dfa_costsharing", "dfa_eligiblepayable", "dfa_totalpaid", "dfa_claimpaiddate",
                        "dfa_claimtotal", "dfa_paidclaimamount", "dfa_onetimedeductionamount", "dfa_claimbpfstages", "dfa_claimbpfsubstages", "dfa_decisioncopy"
                    },
                    Filter = $"dfa_projectclaimid eq {claimId}"
                });

                var lstApps = (from objApp in list.List
                               select new dfa_claim_retrieve
                               {
                                   dfa_name = objApp.dfa_name,
                                   dfa_projectclaimid = objApp.dfa_projectclaimid,
                                   dfa_isfirstclaim = objApp.dfa_isfirstclaim,
                                   dfa_finalclaim = objApp.dfa_finalclaim,
                                   createdon = objApp.createdon,
                                   dfa_claimreceivedbyemcrdate = !string.IsNullOrEmpty(objApp.dfa_claimreceivedbyemcrdate) ? DateTime.Parse(objApp.dfa_claimreceivedbyemcrdate).ToLocalTime().ToString() : objApp.dfa_claimreceivedbyemcrdate,
                                   dfa_claimpaiddate = !string.IsNullOrEmpty(objApp.dfa_claimpaiddate) ? DateTime.Parse(objApp.dfa_claimpaiddate).ToLocalTime().ToString() : objApp.dfa_claimpaiddate,
                                   dfa_totaleligiblegst = objApp.dfa_totaleligiblegst,
                                   dfa_totaloftotaleligible = objApp.dfa_totaloftotaleligible,
                                   dfa_totalapproved = objApp.dfa_totalapproved,
                                   dfa_lessfirst1000 = objApp.dfa_lessfirst1000,
                                   dfa_costsharing = objApp.dfa_costsharing,
                                   dfa_eligiblepayable = objApp.dfa_eligiblepayable,
                                   dfa_totalpaid = objApp.dfa_totalpaid,
                                   dfa_claimtotal = objApp.dfa_claimtotal,
                                   dfa_paidclaimamount = objApp.dfa_paidclaimamount,
                                   dfa_claimbpfstages = objApp.dfa_claimbpfstages,
                                   dfa_claimbpfsubstages = objApp.dfa_claimbpfsubstages,
                                   dfa_decisioncopy = objApp.dfa_decisioncopy

                               }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstApps.FirstOrDefault();
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertInvoice(dfa_invoice_params invoice)
        {
            try
            {
                var jsonVal = JsonConvert.SerializeObject(invoice);
                var result = await api.ExecuteAction("dfa_DFAPortalCreateRecoveryInvoice", invoice);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete invoice {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<string> DeleteInvoice(dfa_invoice_delete_params invoice)
        {
            try
            {
                var jsonVal = JsonConvert.SerializeObject(invoice);
                var result = await api.ExecuteAction("dfa_DFAPortalCreateRecoveryInvoice", invoice);

                if (result != null)
                {
                    return result.Where(m => m.Key == "output") != null ? result.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/delete invoice {ex.Message}", ex);
            }

            return string.Empty;
        }

        public async Task<IEnumerable<dfa_recoveryinvoice>> GetInvoiceListAsync(string claimId)
        {
            try
            {
                var list = await api.GetList<dfa_recoveryinvoice>("dfa_recoveryinvoices", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_name", "_dfa_claim_value",
                        "dfa_recoveryinvoiceid",
                        "dfa_purpose",
                        "dfa_invoicenumber", "dfa_invoicedate", "dfa_goodsorservicesreceiveddate",
                        "dfa_receiveddatesameasinvoicedate", "dfa_portionofinvoice", "dfa_portioninvoicereason",
                        "dfa_netinvoicedbeingclaimed", "dfa_pst", "dfa_grossgst", "dfa_eligiblegst",
                        "createdon", "dfa_actualinvoicetotal", "dfa_totalbeingclaimed", "dfa_emcrdecision",
                        "dfa_emcrapprovedamount", "dfa_emcrdecisiondate", "dfa_emcrdecisioncomments"
                    },
                    Filter = $"_dfa_claim_value eq {claimId}"
                });

                var lstClaims = (from objInvoice in list.List
                                 select new dfa_recoveryinvoice
                                 {
                                     dfa_name = objInvoice.dfa_name,
                                     _dfa_claim_value = objInvoice._dfa_claim_value,
                                     dfa_recoveryinvoiceid = objInvoice.dfa_recoveryinvoiceid,
                                     dfa_purpose = objInvoice.dfa_purpose,
                                     dfa_invoicenumber = objInvoice.dfa_invoicenumber,
                                     dfa_invoicedate = objInvoice.dfa_invoicedate,
                                     dfa_goodsorservicesreceiveddate = objInvoice.dfa_goodsorservicesreceiveddate,
                                     dfa_receiveddatesameasinvoicedate = objInvoice.dfa_receiveddatesameasinvoicedate,
                                     dfa_portionofinvoice = objInvoice.dfa_portionofinvoice,
                                     dfa_portioninvoicereason = objInvoice.dfa_portioninvoicereason,
                                     dfa_netinvoicedbeingclaimed = objInvoice.dfa_netinvoicedbeingclaimed,
                                     dfa_pst = objInvoice.dfa_pst,
                                     dfa_grossgst = objInvoice.dfa_grossgst,
                                     dfa_eligiblegst = objInvoice.dfa_eligiblegst,
                                     createdon = objInvoice.createdon,
                                     dfa_totalbeingclaimed = objInvoice.dfa_totalbeingclaimed,
                                     dfa_actualinvoicetotal = objInvoice.dfa_actualinvoicetotal,
                                     dfa_emcrapprovedamount = objInvoice.dfa_emcrapprovedamount,
                                     dfa_emcrdecision = objInvoice.dfa_emcrdecision,
                                     dfa_emcrdecisioncomments = objInvoice.dfa_emcrdecisioncomments,
                                     dfa_emcrdecisiondate = objInvoice.dfa_emcrdecisiondate
                                 }).AsEnumerable().OrderByDescending(m => m.createdon);

                return lstClaims;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        // 2024-09-17 EMCRI-663 waynezen; check if Primary Contact exists for this specific Application
        public async Task<dfa_applicationprimarycontact_retrieve> GetPrimaryContactbyBCeIDAsync(string bceidUserId)
        {
            var filter = $"dfa_bceiduserguid eq '{bceidUserId}'";
            return await GetPrimaryContact(filter);
        }

        public async Task<dfa_applicationprimarycontact_retrieve> GetPrimaryContactbyContactIdAsync(string contactId)
        {
            var filter = $"dfa_appcontactid eq '{contactId}'";
            return await GetPrimaryContact(filter);
        }

        private async Task<dfa_applicationprimarycontact_retrieve> GetPrimaryContact(string filter)
        {
            try
            {
                var userObj = await api.GetList<dfa_applicationprimarycontact_retrieve>("dfa_appcontacts", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "dfa_appcontactid",
                        "dfa_primaryaddressline1",
                        "dfa_mailingaddresscanadapostverified",
                        "dfa_bceiduserguid",
                        "dfa_bceidbusinessguid",
                        "dfa_bceiduserlogin",
                        "dfa_firstname",
                        "dfa_lastname",
                        "dfa_department",
                        "dfa_businessnumber",
                        "dfa_cellphonenumber",
                        "dfa_emailaddress",
                        "dfa_title",
                        "dfa_notes",
                    },
                    Filter = filter
                });

                return userObj != null ? userObj.List.LastOrDefault() : null;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<dyn_contact> GetVerifiedPrimaryContactbyBCeIDAsync(string bceidUserId)
        {
            try
            {
                var userObj = await api.GetList<dyn_contact>("contacts", new CRMGetListOptions
                {
                    Select = new[]
                    {
                        "contactid",
                        "dfa_bceid_user_guid",
                        "fullname",
                    },
                    Filter = $"dfa_bceid_user_guid eq '{bceidUserId}'"
                });

                return userObj != null ? userObj.List.LastOrDefault() : null;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to obtain access token from {ex.Message}", ex);
            }
        }

        public async Task<string> UpsertPrimaryContactAsync(dfa_applicationprimarycontact_params contact)
        {
            try
            {
                if (contact.dfa_appcontactid == null)
                {
                    // try to find existing Primary Contact using BCeID user guid
                    var exists = await this.GetPrimaryContactbyBCeIDAsync(contact.dfa_bceiduserguid);
                    if (exists != null)
                    {
                        contact.dfa_appcontactid = exists.dfa_appcontactid;
                    }
                }
                // create or update a primary contact
                var newContactResult = await api.ExecuteAction("dfa_BCeIDCreatePrimaryContact", contact);

                if (newContactResult != null)
                {
                    // Dynamics endpoint returns weird value with new contact id; parse out id=
                    // example input string:
                    // https://embc-dfa2.dev.jag.gov.bc.ca:443/main.aspx?etc=10051&id=1c274e75-1677-ef11-b852-00505683fbf4&histKey=377816346&newWindow=true&pagetype=entityrecord]}

                    var newContactDynUrl = newContactResult.Where(m => m.Key == "output") != null ? newContactResult.Where(m => m.Key == "output").ToList()[0].Value.ToString() : string.Empty;

                    var regEx = new Regex("(?<guid>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12})");
                    var match = regEx.Match(newContactDynUrl);
                    if (match.Groups["guid"].Success)
                    {
                        var result = match.Groups["guid"].Value;
                        return result;
                    }
                }
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/create primary contact: {ex.Message}", ex);
            }

            return null;
        }

        public async Task<string> CreateBCeIDAuditEvent(dfa_audit_event auditEvent)
        {
            try
            {
                // create a bceid audit tx
                var result = await api.ExecuteAction("dfa_DFAPortalCreateBCeIDUsers", auditEvent);
                Debug.WriteLine(result);

                return auditEvent.dfa_name;
            }
            catch (System.Exception ex)
            {
                throw new Exception($"Failed to update/create bceid user: {ex.Message}", ex);
            }
        }
    }
}
