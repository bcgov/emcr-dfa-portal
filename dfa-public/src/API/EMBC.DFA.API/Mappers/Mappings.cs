using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using EMBC.DFA.API.ConfigurationModule.Models.AuthModels;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Controllers;
using bceid = EMBC.Gov.BCeID;

namespace EMBC.DFA.API.Mappers
{
    public class Mappings : AutoMapper.Profile
    {
        public Mappings()
        {
            //(!string.IsNullOrEmpty(s.PersonalDetails.IndigenousStatus) ? (s.PersonalDetails.IndigenousStatus.ToLower() == "yes" ? true : false) : null)
            CreateMap<Profile, dfa_appcontact>()
                .ForMember(d => d.dfa_firstname, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.dfa_lastname, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.dfa_initial, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.dfa_isindigenous2, opts => opts.MapFrom(s => s.PersonalDetails.IndigenousStatus == null ? (int?)YesNoNullOptionSet.Null : (s.PersonalDetails.IndigenousStatus.ToLower() == "yes" ? (int?)YesNoNullOptionSet.Yes : (int?)YesNoNullOptionSet.No)))
                .ForMember(d => d.dfa_emailaddress, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.dfa_cellphonenumber, opts => opts.MapFrom(s => s.ContactDetails.CellPhoneNumber))
                .ForMember(d => d.dfa_residencetelephonenumber, opts => opts.MapFrom(s => s.ContactDetails.ResidencePhone))
                .ForMember(d => d.dfa_alternatephonenumber, opts => opts.MapFrom(s => s.ContactDetails.AlternatePhone))
                .ForMember(d => d.dfa_primaryaddressline1, opts => opts.MapFrom(s => s.PrimaryAddress.AddressLine1))
                .ForMember(d => d.dfa_primaryaddressline2, opts => opts.MapFrom(s => s.PrimaryAddress.AddressLine2))
                .ForMember(d => d.dfa_primarycity, opts => opts.MapFrom(s => s.PrimaryAddress.City))
                .ForMember(d => d.dfa_primarypostalcode, opts => opts.MapFrom(s => s.PrimaryAddress.PostalCode))
                .ForMember(d => d.dfa_primarystateprovince, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince))
                .ForMember(d => d.dfa_secondaryaddressline1, opts => opts.MapFrom(s => s.MailingAddress.AddressLine1))
                .ForMember(d => d.dfa_secondaryaddressline2, opts => opts.MapFrom(s => s.MailingAddress.AddressLine2))
                .ForMember(d => d.dfa_secondarycity, opts => opts.MapFrom(s => s.MailingAddress.City))
                .ForMember(d => d.dfa_secondarypostalcode, opts => opts.MapFrom(s => s.MailingAddress.PostalCode))
                .ForMember(d => d.dfa_secondarystateprovince, opts => opts.MapFrom(s => s.MailingAddress.StateProvince))
                //.ForMember(d => d.dfa_bcservicecardid, opts => opts.MapFrom(s => s.BCServiceCardId))
                .ForMember(d => d.dfa_appcontactid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.dfa_isprimaryandsecondaryaddresssame, opts => opts.MapFrom(s => (!string.IsNullOrEmpty(s.IsMailingAddressSameAsPrimaryAddress) ?
                                                (s.IsMailingAddressSameAsPrimaryAddress.ToLower() == SameAddressOptionSet.Yes.ToString().ToLower() ? Convert.ToInt32(SameAddressOptionSet.Yes) :
                                                (s.IsMailingAddressSameAsPrimaryAddress.ToLower() == SameAddressOptionSet.No.ToString().ToLower() ? Convert.ToInt32(SameAddressOptionSet.No) : Convert.ToInt32(SameAddressOptionSet.NoAddress))) : Convert.ToInt32(SameAddressOptionSet.NoAddress))))
                .ForMember(d => d.dfa_lastdateupdated, opts => opts.MapFrom(s => s.lastUpdatedDateBCSC))
                .ForMember(d => d.dfa_mailingaddresscanadapostverified, opts => opts.MapFrom(s => s.MailingAddress.isAddressVerified == null ? (int?)null : (s.MailingAddress.isAddressVerified == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_mailingaddresscanadapostverified, opts => opts.MapFrom(s => s.PrimaryAddress.isAddressVerified == null ? true : true))
                .ReverseMap()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.dfa_appcontactid))
                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s => (s.dfa_isprimaryandsecondaryaddresssame.HasValue ?
                                                (s.dfa_isprimaryandsecondaryaddresssame == Convert.ToInt32(SameAddressOptionSet.Yes) ? SameAddressOptionSet.Yes.ToString() :
                                                (s.dfa_isprimaryandsecondaryaddresssame == Convert.ToInt32(SameAddressOptionSet.No) ? SameAddressOptionSet.No.ToString() : SameAddressOptionSet.NoAddress.ToString())) : SameAddressOptionSet.NoAddress.ToString())))
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => new PersonDetails()
                {
                    FirstName = s.dfa_firstname,
                    LastName = s.dfa_lastname,
                    Initials = s.dfa_initial,
                    IndigenousStatus = s.dfa_isindigenous2 == Convert.ToInt32(YesNoNullOptionSet.Yes) ? "Yes" : (s.dfa_isindigenous2 == Convert.ToInt32(YesNoNullOptionSet.No) ? "No" : null)
                }))
                ;

            CreateMap<Controllers.Profile, ESS.Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ForMember(d => d.AuthenticatedUser, opts => opts.Ignore())
                .ForMember(d => d.VerifiedUser, opts => opts.Ignore())
                .ForMember(d => d.IsMinor, opts => opts.Ignore())
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.CellPhoneNumber))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())

                .ReverseMap()

                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s =>
                    string.Equals(s.MailingAddress.Country, s.PrimaryAddress.Country, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.StateProvince, s.PrimaryAddress.StateProvince, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.Community, s.PrimaryAddress.Community, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.City, s.PrimaryAddress.City, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.PostalCode, s.PrimaryAddress.PostalCode, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine1, s.PrimaryAddress.AddressLine1, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine2, s.PrimaryAddress.AddressLine2, StringComparison.InvariantCultureIgnoreCase)))
                ;

            CreateMap<DFAApplicationStart, dfa_appapplicationstart_params>()
                .ForMember(d => d.dfa_applicanttype, opts => opts.MapFrom(s => s.AppTypeInsurance.applicantOption == ApplicantOption.Homeowner ? ApplicantTypeOptionSet.HomeOwner :
                    (s.AppTypeInsurance.applicantOption == ApplicantOption.ResidentialTenant ? ApplicantTypeOptionSet.ResidentialTenant :
                    (s.AppTypeInsurance.applicantOption == ApplicantOption.FarmOwner ? ApplicantTypeOptionSet.FarmOwner :
                    (s.AppTypeInsurance.applicantOption == ApplicantOption.CharitableOrganization ? ApplicantTypeOptionSet.CharitableOrganization :
                    (s.AppTypeInsurance.applicantOption == ApplicantOption.SmallBusinessOwner ? ApplicantTypeOptionSet.SmallBusinessOwner : ApplicantTypeOptionSet.HomeOwner))))))
                .ForMember(d => d.dfa_doyouhaveinsurancecoverage2, opts => opts.MapFrom(s => s.AppTypeInsurance.insuranceOption == InsuranceOption.Yes ? InsuranceTypeOptionSet.Yes :
                    (s.AppTypeInsurance.insuranceOption == InsuranceOption.No ? InsuranceTypeOptionSet.No :
                    (s.AppTypeInsurance.insuranceOption == InsuranceOption.Unsure ? InsuranceTypeOptionSet.YesBut : InsuranceTypeOptionSet.Yes))))
                .ForMember(d => d.dfa_smallbusinesstype, opts => opts.MapFrom(s => s.AppTypeInsurance.smallBusinessOption == SmallBusinessOption.General ? (int?)SmallBusinessOptionSet.General :
                    (s.AppTypeInsurance.smallBusinessOption == SmallBusinessOption.Corporate ? (int?)SmallBusinessOptionSet.Corporate :
                    (s.AppTypeInsurance.smallBusinessOption == SmallBusinessOption.Landlord ? (int?)SmallBusinessOptionSet.Landlord : (int?)null))))
                .ForMember(d => d.dfa_farmtype, opts => opts.MapFrom(s => s.AppTypeInsurance.farmOption == FarmOption.General ? (int?)FarmOptionSet.General :
                    (s.AppTypeInsurance.farmOption == FarmOption.Corporate ? (int?)FarmOptionSet.Corporate : (int?)null)))
                .ForMember(d => d.dfa_appcontactid, opts => opts.MapFrom(s => s.ProfileVerification.profileId))
                .ForMember(d => d.dfa_primaryapplicantsignednoins, opts => opts.MapFrom(s => s.AppTypeInsurance.applicantSignature != null ? YesNoOptionSet.Yes : YesNoOptionSet.No))
                .ForMember(d => d.dfa_primaryapplicantprintnamenoins, opts => opts.MapFrom(s => s.AppTypeInsurance.applicantSignature.signedName))
                .ForMember(d => d.dfa_primaryapplicantsigneddatenoins, opts => opts.MapFrom(s => (s.AppTypeInsurance.applicantSignature == null || string.IsNullOrEmpty(s.AppTypeInsurance.applicantSignature.dateSigned)) ? null : s.AppTypeInsurance.applicantSignature.dateSigned.Substring(0, 10)))
                .ForMember(d => d.dfa_secondaryapplicantsignednoins, opts => opts.MapFrom(s => s.AppTypeInsurance.secondaryApplicantSignature != null ? YesNoOptionSet.Yes : YesNoOptionSet.No))
                .ForMember(d => d.dfa_secondaryapplicantprintnamenoins, opts => opts.MapFrom(s => s.AppTypeInsurance.secondaryApplicantSignature.signedName))
                .ForMember(d => d.dfa_secondaryapplicantsigneddatenoins, opts => opts.MapFrom(s => (s.AppTypeInsurance.secondaryApplicantSignature == null || string.IsNullOrEmpty(s.AppTypeInsurance.secondaryApplicantSignature.dateSigned)) ? null : s.AppTypeInsurance.secondaryApplicantSignature.dateSigned.Substring(0, 10)))
                .ForMember(d => d.dfa_damagedpropertystreet1, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.addressLine1))
                .ForMember(d => d.dfa_damagedpropertystreet2, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.addressLine2))
                .ForMember(d => d.dfa_damagedpropertycitytext, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.city))
                .ForMember(d => d.dfa_damagedpropertypostalcode, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.postalCode))
                .ForMember(d => d.dfa_damagedpropertyprovince, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.stateProvince))
                .ForMember(d => d.dfa_isprimaryanddamagedaddresssame2, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.isPrimaryAndDamagedAddressSame == null ? (int?)null : (s.OtherPreScreeningQuestions.isPrimaryAndDamagedAddressSame == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_damagedpropertyaddresscanadapostverified, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.isDamagedAddressVerified == null ? (int?)null : (s.OtherPreScreeningQuestions.isDamagedAddressVerified == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                //.ForMember(d => d.dfa_eventid, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.eventId)) // TO DO : uncomment
                //.ForMember(d => d.dfa_doyourlossestotalmorethan10002, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.lossesExceed1000 == null ? (int?)null : (s.OtherPreScreeningQuestions.lossesExceed1000 == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_dateofdamage, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.damageFromDate));

            CreateMap<DFAApplicationStart, temp_dfa_appapplicationstart_params>()
                .ForMember(d => d.dfa_eventid, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.eventId)) // move to mapping above
                .ForMember(d => d.dfa_doyourlossestotalmorethan10002, opts => opts.MapFrom(s => s.OtherPreScreeningQuestions.lossesExceed1000 == null ? (int?)null : (s.OtherPreScreeningQuestions.lossesExceed1000 == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))); // TODO move to mapping above

            CreateMap<dfa_appapplicationstart_retrieve, ProfileVerification>()
               .ForMember(d => d.profileVerified, opts => opts.Ignore())
               .ForMember(d => d.profileId, opts => opts.MapFrom(s => s._dfa_applicant_value));

            CreateMap<dfa_appapplicationstart_retrieve, Consent>()
                .ForMember(d => d.consent, opts => opts.Ignore());

            CreateMap<dfa_appapplicationstart_retrieve, AppTypeInsurance>()
                .ForPath(d => d.applicantSignature.dateSigned, opts => opts.MapFrom(s => s.dfa_primaryapplicantsigneddatenoins))
                .ForPath(d => d.applicantSignature.signedName, opts => opts.MapFrom(s => s.dfa_primaryapplicantprintnamenoins))
                .ForPath(d => d.secondaryApplicantSignature.dateSigned, opts => opts.MapFrom(s => s.dfa_secondaryapplicantsigneddatenoins))
                .ForPath(d => d.secondaryApplicantSignature.signedName, opts => opts.MapFrom(s => s.dfa_secondaryapplicantprintnamenoins))
                .ForMember(d => d.applicantOption, opts => opts.MapFrom(s => s.dfa_applicanttype == (int)ApplicantTypeOptionSet.HomeOwner ? ApplicantOption.Homeowner :
                    (s.dfa_applicanttype == (int)ApplicantTypeOptionSet.ResidentialTenant ? ApplicantOption.ResidentialTenant :
                    (s.dfa_applicanttype == (int)ApplicantTypeOptionSet.SmallBusinessOwner ? ApplicantOption.SmallBusinessOwner :
                    (s.dfa_applicanttype == (int)ApplicantTypeOptionSet.FarmOwner ? ApplicantOption.FarmOwner :
                    (s.dfa_applicanttype == (int)ApplicantTypeOptionSet.CharitableOrganization ? ApplicantOption.CharitableOrganization : ApplicantOption.Homeowner))))))
                .ForMember(d => d.farmOption, opts => opts.MapFrom(s => s.dfa_farmtype == (int)FarmOptionSet.General ? FarmOption.General :
                    (s.dfa_farmtype == (int)FarmOptionSet.Corporate ? FarmOption.Corporate : FarmOption.General)))
                .ForMember(d => d.smallBusinessOption, opts => opts.MapFrom(s => s.dfa_smallbusinesstype == (int)SmallBusinessOptionSet.General ? SmallBusinessOption.General :
                    (s.dfa_smallbusinesstype == (int)SmallBusinessOptionSet.Corporate ? SmallBusinessOption.Corporate :
                    (s.dfa_smallbusinesstype == (int)SmallBusinessOptionSet.Landlord ? SmallBusinessOption.Landlord : SmallBusinessOption.General))))
                .ForMember(d => d.insuranceOption, opts => opts.MapFrom(s => s.dfa_doyouhaveinsurancecoverage2 == (int)InsuranceTypeOptionSet.Yes ? InsuranceOption.Yes :
                    (s.dfa_doyouhaveinsurancecoverage2 == (int)InsuranceTypeOptionSet.No ? InsuranceOption.No :
                    (s.dfa_doyouhaveinsurancecoverage2 == (int)InsuranceTypeOptionSet.YesBut ? InsuranceOption.Unsure : InsuranceOption.Yes))));

            CreateMap<dfa_appapplicationstart_retrieve, OtherPreScreeningQuestions>()
                .ForMember(d => d.addressLine1, opts => opts.MapFrom(s => s.dfa_damagedpropertystreet1))
                .ForMember(d => d.addressLine2, opts => opts.MapFrom(s => s.dfa_damagedpropertystreet1))
                .ForMember(d => d.city, opts => opts.MapFrom(s => s.dfa_damagedpropertycitytext))
                .ForMember(d => d.postalCode, opts => opts.MapFrom(s => s.dfa_damagedpropertypostalcode))
                .ForMember(d => d.stateProvince, opts => opts.MapFrom(s => s.dfa_damagedpropertyprovince))
                .ForMember(d => d.eventId, opts => opts.MapFrom(s => s._dfa_eventid_value))
                .ForMember(d => d.isPrimaryAndDamagedAddressSame, opts => opts.MapFrom(s => s.dfa_isprimaryanddamagedaddresssame2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_isprimaryanddamagedaddresssame2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.damageFromDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamage) ? DateTime.Parse(s.dfa_dateofdamage).ToString("o") + "Z" : s.dfa_dateofdamage))
                .ForMember(d => d.lossesExceed1000, opts => opts.MapFrom(s => s.dfa_doyourlossestotalmorethan10002 == (int)YesNoOptionSet.Yes ? true : (s.dfa_doyourlossestotalmorethan10002 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.damageCausedByDisaster, opts => opts.MapFrom(s => true));

            CreateMap<DFAApplicationMain, dfa_appapplicationmain_params>()
                .ForMember(d => d.dfa_appapplicationid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.dfa_applicanttype, opts => opts.MapFrom(s => Convert.ToInt32(ApplicantTypeOptionSet.GovernmentBody)))
                .ForMember(d => d.dfa_appcontactid, opts => opts.MapFrom(s => s.ProfileVerification.profileId))
                .ForMember(d => d.dfa_causeofdamagestorm2, opts => opts.MapFrom(s => s.propertyDamage.stormDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamagewildfire2, opts => opts.MapFrom(s => s.propertyDamage.wildfireDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_receiveguidanceassessingyourinfra, opts => opts.MapFrom(s => s.propertyDamage.guidanceSupport == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageflood2, opts => opts.MapFrom(s => s.propertyDamage.floodDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamagelandslide2, opts => opts.MapFrom(s => s.propertyDamage.landslideDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageother2, opts => opts.MapFrom(s => s.propertyDamage.otherDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageloss, opts => opts.MapFrom(s => s.propertyDamage.otherDamageText))
                .ForMember(d => d.dfa_applicantsubtype, opts => opts.MapFrom(s => ConvertStringToApplicantSubTypeOptionSet(s.propertyDamage.applicantSubtype)))
                .ForMember(d => d.dfa_applicantlocalgovsubtype, opts => opts.MapFrom(s => ConvertStringToApplicantSubTypeSubOptionSet(s.propertyDamage.applicantSubSubtype)))
                .ForMember(d => d.dfa_applicantothercomments, opts => opts.MapFrom(s => s.propertyDamage.subtypeOtherDetails))
                .ForMember(d => d.dfa_dfaapplicantsubtypecomments, opts => opts.MapFrom(s => s.propertyDamage.subtypeDFAComment))
                .ForMember(d => d.dfa_estimated, opts => opts.MapFrom(s => s.propertyDamage.estimatedPercent))
                .ForMember(d => d.dfa_dateofdamage, opts => opts.MapFrom(s => s.propertyDamage.damageFromDate))
                .ForMember(d => d.dfa_dateofdamageto, opts => opts.MapFrom(s => s.propertyDamage.damageToDate));

            CreateMap<dfa_appapplicationmain_retrieve, CleanUpLog>()
                .ForMember(d => d.haveInvoicesOrReceiptsForCleanupOrRepairs, opts => opts.MapFrom(s => s.dfa_haveinvoicesreceiptsforcleanuporrepairs2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_haveinvoicesreceiptsforcleanuporrepairs2 == (int)YesNoOptionSet.No ? false : (bool?)null)));

            CreateMap<dfa_appapplicationmain_retrieve, SupportingDocuments>()
                .ForMember(d => d.hasCopyOfARentalAgreementOrLease, opts => opts.MapFrom(s => s.dfa_acopyofarentalagreementorlease2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_acopyofarentalagreementorlease2 == (int)YesNoOptionSet.No ? false : (bool?)null)));

            CreateMap<dfa_appapplicationmain_retrieve, DamagedPropertyAddress>()
                .ForMember(d => d.addressLine1, opts => opts.MapFrom(s => s.dfa_damagedpropertystreet1))
                .ForMember(d => d.addressLine2, opts => opts.MapFrom(s => s.dfa_damagedpropertystreet2))
                .ForMember(d => d.community, opts => opts.MapFrom(s => s.dfa_damagedpropertycitytext))
                .ForMember(d => d.postalCode, opts => opts.MapFrom(s => s.dfa_damagedpropertypostalcode))
                .ForMember(d => d.stateProvince, opts => opts.MapFrom(s => s.dfa_damagedpropertyprovince))
                .ForMember(d => d.occupyAsPrimaryResidence, opts => opts.MapFrom(s => s.dfa_isthispropertyyourp2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_isthispropertyyourp2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.onAFirstNationsReserve, opts => opts.MapFrom(s => s.dfa_indigenousreserve2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_indigenousreserve2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.firstNationsReserve, opts => opts.MapFrom(s => s.dfa_nameoffirstnationsr))
                .ForMember(d => d.manufacturedHome, opts => opts.MapFrom(s => s.dfa_manufacturedhom2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_manufacturedhom2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.eligibleForHomeOwnerGrant, opts => opts.MapFrom(s => s.dfa_eligibleforbchomegrantonthisproperty2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_eligibleforbchomegrantonthisproperty2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.landlordGivenNames, opts => opts.MapFrom(s => s.dfa_contactfirstname))
                .ForMember(d => d.landlordSurname, opts => opts.MapFrom(s => s.dfa_contactlastname))
                .ForMember(d => d.landlordPhone, opts => opts.MapFrom(s => s.dfa_contactphone1))
                .ForMember(d => d.landlordEmail, opts => opts.MapFrom(s => s.dfa_contactemail))
                .ForMember(d => d.businessLegalName, opts => opts.MapFrom(s => s.dfa_accountlegalname))
                .ForMember(d => d.businessManagedByAllOwnersOnDayToDayBasis, opts => opts.MapFrom(s => s.dfa_businessmanagedbyallownersondaytodaybasis == (int)YesNoOptionSet.Yes ? true : (s.dfa_businessmanagedbyallownersondaytodaybasis == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.employLessThan50EmployeesAtAnyOneTime, opts => opts.MapFrom(s => s.dfa_employlessthan50employeesatanyonetime == (int)YesNoOptionSet.Yes ? true : (s.dfa_employlessthan50employeesatanyonetime == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.grossRevenues100002000000BeforeDisaster, opts => opts.MapFrom(s => s.dfa_grossrevenues100002000000beforedisaster == (int)YesNoOptionSet.Yes ? true : (s.dfa_grossrevenues100002000000beforedisaster == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.lossesExceed1000, opts => opts.MapFrom(s => s.dfa_doyourlossestotalmorethan10002 == (int)YesNoOptionSet.Yes ? true : (s.dfa_doyourlossestotalmorethan10002 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.farmoperation, opts => opts.MapFrom(s => s.dfa_farmoperation == (int)YesNoOptionSet.Yes ? true : (s.dfa_farmoperation == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.ownedandoperatedbya, opts => opts.MapFrom(s => s.dfa_ownedandoperatedbya == (int)YesNoOptionSet.Yes ? true : (s.dfa_ownedandoperatedbya == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.farmoperationderivesthatpersonsmajorincom, opts => opts.MapFrom(s => s.dfa_farmoperationderivesthatpersonsmajorincom == (int)YesNoOptionSet.Yes ? true : (s.dfa_farmoperationderivesthatpersonsmajorincom == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.charityRegistered, opts => opts.MapFrom(s => s.dfa_charityregistered == (int)YesNoOptionSet.Yes ? true : (s.dfa_charityregistered == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.charityExistsAtLeast12Months, opts => opts.MapFrom(s => s.dfa_charityexistsatleast12months == (int)YesNoOptionSet.Yes ? true : (s.dfa_charityexistsatleast12months == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.charityProvidesCommunityBenefit, opts => opts.MapFrom(s => s.dfa_charityprovidescommunitybenefit == (int)YesNoOptionSet.Yes ? true : (s.dfa_charityprovidescommunitybenefit == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.isPrimaryAndDamagedAddressSame, opts => opts.MapFrom(s => s.dfa_isprimaryanddamagedaddresssame2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_isprimaryanddamagedaddresssame2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.isDamagedAddressVerified, opts => opts.MapFrom(s => s.dfa_damagedpropertyaddresscanadapostverified == (int)YesNoOptionSet.Yes ? true : (s.dfa_damagedpropertyaddresscanadapostverified == (int)YesNoOptionSet.No ? false : (bool?)null)));

            CreateMap<dfa_appapplicationmain_retrieve, PropertyDamage>()
                .ForMember(d => d.stormDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagestorm2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagestorm2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.wildfireDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagewildfire2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagewildfire2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.landslideDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.otherDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageother2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageother2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.floodDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.guidanceSupport, opts => opts.MapFrom(s => s.dfa_receiveguidanceassessingyourinfra == (int)YesNoOptionSet.Yes ? true : (s.dfa_receiveguidanceassessingyourinfra == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.otherDamageText, opts => opts.MapFrom(s => s.dfa_causeofdamageloss))

                .ForMember(d => d.applicantSubtype, opts => opts.MapFrom(s => GetEnumDescription((ApplicantSubtypeCategoriesOptionSet)s.dfa_applicantsubtype).ToString()))
                .ForMember(d => d.applicantSubSubtype, opts => opts.MapFrom(s => GetEnumDescription((ApplicantSubtypeSubCategoriesOptionSet)s.dfa_applicantlocalgovsubtype).ToString()))
                .ForMember(d => d.subtypeOtherDetails, opts => opts.MapFrom(s => s.dfa_applicantothercomments))
                .ForMember(d => d.estimatedPercent, opts => opts.MapFrom(s => s.dfa_estimated))
                .ForMember(d => d.subtypeDFAComment, opts => opts.MapFrom(s => s.dfa_dfaapplicantsubtypecomments))

                .ForMember(d => d.damageFromDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamage) ? DateTime.Parse(s.dfa_dateofdamage).ToString("o") + "Z" : s.dfa_dateofdamage))
                .ForMember(d => d.damageToDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamageto) ? DateTime.Parse(s.dfa_dateofdamageto).ToString("o") + "Z" : s.dfa_dateofdamageto));

            CreateMap<dfa_appapplicationmain_retrieve, SignAndSubmit>()
                .ForMember(d => d.ninetyDayDeadline, opts => opts.MapFrom(s => s.dfa_90daydeadline))
                .ForPath(d => d.applicantSignature.signedName, opts => opts.MapFrom(s => s.dfa_primaryapplicantprintname))
                .ForPath(d => d.applicantSignature.dateSigned, opts => opts.MapFrom(s => s.dfa_primaryapplicantsigneddate))
                .ForPath(d => d.applicantSignature.signature, opts => opts.MapFrom(s => s.dfa_primaryapplicantsignature != null ? "data:image/png;base64," + s.dfa_primaryapplicantsignature : null))
                .ForPath(d => d.secondaryApplicantSignature.signedName, opts => opts.MapFrom(s => s.dfa_secondaryapplicantprintname))
                .ForPath(d => d.secondaryApplicantSignature.dateSigned, opts => opts.MapFrom(s => s.dfa_secondaryapplicantsigneddate))
                .ForPath(d => d.secondaryApplicantSignature.signature, opts => opts.MapFrom(s => s.dfa_secondaryapplicantsignature != null ? "data:image/png;base64," + s.dfa_secondaryapplicantsignature : null));

            CreateMap<dfa_appsecondaryapplicant_retrieve, SecondaryApplicant>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_appapplicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appsecondaryapplicantid))
                .ForMember(d => d.applicantType, opts => opts.MapFrom(s => s.dfa_applicanttype == (int)SecondaryApplicantTypeOptionSet.Contact ? SecondaryApplicantTypeOption.Contact : SecondaryApplicantTypeOption.Organization))
                .ForMember(d => d.email, opts => opts.MapFrom(s => s.dfa_emailaddress))
                .ForMember(d => d.firstName, opts => opts.MapFrom(s => s.dfa_firstname))
                .ForMember(d => d.lastName, opts => opts.MapFrom(s => s.dfa_lastname))
                .ForMember(d => d.phoneNumber, opts => opts.MapFrom(s => s.dfa_phonenumber))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<SecondaryApplicant, dfa_appsecondaryapplicant_params>()
                .ForMember(d => d.dfa_appapplicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_appsecondaryapplicantid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.dfa_applicanttype, opts => opts.MapFrom(s => s.applicantType == (int)SecondaryApplicantTypeOption.Contact ? SecondaryApplicantTypeOptionSet.Contact : SecondaryApplicantTypeOptionSet.Organization))
                .ForMember(d => d.dfa_emailaddress, opts => opts.MapFrom(s => s.email))
                .ForMember(d => d.dfa_firstname, opts => opts.MapFrom(s => s.firstName))
                .ForMember(d => d.dfa_lastname, opts => opts.MapFrom(s => s.lastName))
                .ForMember(d => d.dfa_phonenumber, opts => opts.MapFrom(s => s.phoneNumber))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag));

            CreateMap<dfa_appothercontact_retrieve, OtherContact>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_appapplicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appothercontactid))
                .ForMember(d => d.email, opts => opts.MapFrom(s => s.dfa_emailaddress))
                .ForMember(d => d.firstName, opts => opts.MapFrom(s => s.dfa_firstname != null ? s.dfa_firstname : s.dfa_name))
                .ForMember(d => d.lastName, opts => opts.MapFrom(s => s.dfa_lastname != null ? s.dfa_lastname : s.dfa_name))
                .ForMember(d => d.phoneNumber, opts => opts.MapFrom(s => s.dfa_phonenumber))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<FullTimeOccupant, dfa_appoccupant_params>()
                .ForMember(d => d.dfa_appapplicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_appoccupantid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.dfa_name, opts => opts.MapFrom(s => s.lastName + ", " + s.firstName))
                .ForMember(d => d.dfa_title, opts => opts.MapFrom(s => s.relationship))
                .ForMember(d => d.dfa_firstname, opts => opts.MapFrom(s => s.firstName))
                .ForMember(d => d.dfa_lastname, opts => opts.MapFrom(s => s.lastName))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag));

            CreateMap<dfa_appoccupant_retrieve, FullTimeOccupant>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_applicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appoccupantid))
                .ForMember(d => d.firstName, opts => opts.MapFrom(s => s.dfa_firstname))
                .ForMember(d => d.lastName, opts => opts.MapFrom(s => s.dfa_lastname))
                .ForMember(d => d.relationship, opts => opts.MapFrom(s => s.dfa_relationshiptoapplicant))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<OtherContact, dfa_appothercontact_params>()
                .ForMember(d => d.dfa_appapplicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_appothercontactid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.dfa_appemailaddress, opts => opts.MapFrom(s => s.email))
                .ForMember(d => d.dfa_firstname, opts => opts.MapFrom(s => s.firstName))
                .ForMember(d => d.dfa_lastname, opts => opts.MapFrom(s => s.lastName))
                .ForMember(d => d.dfa_phonenumber, opts => opts.MapFrom(s => s.phoneNumber))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag));

            CreateMap<dfa_appcleanuplogs_retrieve, CleanUpLogItem>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_applicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appcleanuplogid))
                .ForMember(d => d.date, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_date) ? DateTime.Parse(s.dfa_date).ToString("o") + "Z" : s.dfa_date))
                .ForMember(d => d.name, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.hours, opts => opts.MapFrom(s => s.dfa_hoursworked))
                .ForMember(d => d.description, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<CleanUpLogItem, dfa_appcleanuplogs_params>()
                .ForMember(d => d.dfa_applicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_appcleanuplogid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.dfa_date, opts => opts.MapFrom(s => s.date))
                .ForMember(d => d.dfa_name, opts => opts.MapFrom(s => s.description))
                .ForMember(d => d.dfa_hoursworked, opts => opts.MapFrom(s => s.hours))
                .ForMember(d => d.dfa_appcontactname, opts => opts.MapFrom(s => s.name))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag));

            CreateMap<dfa_projectdocumentlocation, FileUpload>()
                .ForMember(d => d.projectId, opts => opts.MapFrom(s => s._dfa_projectid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_projectdocumentlocationid))
                .ForMember(d => d.fileName, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => ConvertStringToFileCategory(s.dfa_documenttype)))
                .ForMember(d => d.fileTypeText, opts => opts.MapFrom(s => s.dfa_documenttype))
                .ForMember(d => d.requiredDocumentType, opts => opts.MapFrom(s => ConvertStringToRequiredDocumentType(s.dfa_requireddocumenttype)))
                .ForMember(d => d.fileDescription, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.uploadedDate, opts => opts.MapFrom(s => s.createdon))
                .ForMember(d => d.modifiedBy, opts => opts.MapFrom(s => s.dfa_modifiedby))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<dfa_projectclaimdocumentlocation, FileUploadClaim>()
                .ForMember(d => d.claimId, opts => opts.MapFrom(s => s._dfa_projectclaimid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_projectclaimdocumentlocationid))
                .ForMember(d => d.fileName, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => ConvertStringToFileCategoryClaim(s.dfa_documenttype)))
                .ForMember(d => d.fileTypeText, opts => opts.MapFrom(s => s.dfa_documenttype))
                .ForMember(d => d.requiredDocumentType, opts => opts.MapFrom(s => ConvertStringToRequiredDocumentTypeClaim(s.dfa_requireddocumenttype)))
                .ForMember(d => d.fileDescription, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.uploadedDate, opts => opts.MapFrom(s => s.createdon))
                .ForMember(d => d.modifiedBy, opts => opts.MapFrom(s => s.dfa_modifiedby))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<FileUpload, AttachmentEntity>()
                .ForMember(d => d.filename, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.activitysubject, opts => opts.MapFrom(s => "dfa_project"))
                .ForMember(d => d.subject, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.fileDescription) ? s.fileName : s.fileDescription))
                .ForMember(d => d.body, opts => opts.MapFrom(s => s.fileData));

            CreateMap<FileUploadClaim, AttachmentEntity>()
                .ForMember(d => d.filename, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.activitysubject, opts => opts.MapFrom(s => "dfa_projectclaim"))
                .ForMember(d => d.subject, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.fileDescription) ? s.fileName : s.fileDescription))
                .ForMember(d => d.body, opts => opts.MapFrom(s => s.fileData));

            CreateMap<FileUpload, SubmissionEntity>()
                .ForMember(d => d.dfa_projectid, opts => opts.MapFrom(s => s.project.Id)) // s.projectId
                .ForMember(d => d.dfa_description, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.dfa_modifiedby, opts => opts.MapFrom(s => s.modifiedBy))
                .ForMember(d => d.dfa_requireddocumenttype, opts => opts.MapFrom(s => s.requiredDocumentType)) // TODO map required file type
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => s.fileType));

            CreateMap<FileUploadClaim, SubmissionEntityClaim>()
                .ForMember(d => d.dfa_projectclaimid, opts => opts.MapFrom(s => s.claimId)) // s.projectId
                .ForMember(d => d.dfa_description, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.dfa_modifiedby, opts => opts.MapFrom(s => s.modifiedBy))
                .ForMember(d => d.dfa_requireddocumenttype, opts => opts.MapFrom(s => s.requiredDocumentType)) // TODO map required file type
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => s.fileType));

            CreateMap<dfa_project, CurrentProject>()
                .ForMember(d => d.Deadline18Month, opts => opts.MapFrom(s => Convert.ToDateTime(s.dfa_18monthdeadline).Year < 2020 ? "Date Not Set" : Convert.ToDateTime(s.dfa_18monthdeadline).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.ProjectNumber, opts => opts.MapFrom(s => s.dfa_projectnumber))
                .ForMember(d => d.ProjectId, opts => opts.MapFrom(s => s.dfa_projectid))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_projectbusinessprocessstages) ? GetEnumDescription((ProjectStages)Convert.ToInt32(s.dfa_projectbusinessprocessstages)) : null))
                .ForMember(d => d.Stage, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_projectbusinessprocesssubstages) ? GetEnumDescription((ProjectSubStages)Convert.ToInt32(s.dfa_projectbusinessprocesssubstages)) : null))
                //.ForMember(d => d.Status, opts => opts.MapFrom(s => Convert.ToString(ProjectStages.Submitted)))
                //.ForMember(d => d.Stage, opts => opts.MapFrom(s => Convert.ToString(ProjectSubStages.Pending)))
                //.ForMember(d => d.Stage, opts => opts.MapFrom(s => s.dfa_projectbusinessprocessstages))
                .ForMember(d => d.ProjectName, opts => opts.MapFrom(s => s.dfa_projectname))
                .ForMember(d => d.SiteLocation, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_sitelocation) ? "Not Set" : s.dfa_sitelocation))
                .ForMember(d => d.EMCRApprovedAmount, opts => opts.MapFrom(s => s.dfa_approvedcost == null ? 0 : s.dfa_approvedcost))
                .ForMember(d => d.CreatedDate, opts => opts.MapFrom(s => s.createdon))
                .ForMember(d => d.EstimatedCompletionDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.dfa_estimatedcompletiondateofproject).Year < 2020 ? "Date Not Set" : Convert.ToDateTime(s.dfa_estimatedcompletiondateofproject).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)));

            CreateMap<dfa_projectclaim, CurrentClaim>()
                .ForMember(d => d.ClaimNumber, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.CreatedDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.createdon).Year < 2020 ? "Date Not Set" : Convert.ToDateTime(s.createdon).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.SubmittedDate, opts => opts.MapFrom(s => Convert.ToDateTime(s.dfa_claimreceivedbyemcrdate).Year < 2020 ? "Date Not Set" : Convert.ToDateTime(s.dfa_claimreceivedbyemcrdate).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.FirstClaim, opts => opts.MapFrom(s => s.dfa_isfirstclaim))
                .ForMember(d => d.FinalClaim, opts => opts.MapFrom(s => s.dfa_finalclaim))
                .ForMember(d => d.ClaimTotal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totaloftotaleligible) ? "CA$ 0" : "CA$ " + s.dfa_totaloftotaleligible))
                .ForMember(d => d.ApprovedClaimTotal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totalapproved) || s.dfa_totalapproved == "0" ? "(pending information)" : "CA$ " + s.dfa_totalapproved))
                .ForMember(d => d.LessFirst1000, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_lessfirst1000) ? "(pending information)" : "CA$ " + s.dfa_lessfirst1000))
                .ForMember(d => d.ApprovedReimbursePercent, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_costsharing) ? "(pending information)" : "CA$ " + s.dfa_costsharing))
                .ForMember(d => d.EligiblePayable, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_eligiblepayable) ? "(pending information)" : "CA$ " + s.dfa_eligiblepayable))
                .ForMember(d => d.PaidClaimAmount, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totalpaid) ? "(pending information)" : "CA$ " + s.dfa_totalpaid))
                .ForMember(d => d.ClaimId, opts => opts.MapFrom(s => s.dfa_projectclaimid))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_claimbpfstages) ? GetEnumDescription((ClaimStages)Convert.ToInt32(s.dfa_claimbpfstages)) : null))
                .ForMember(d => d.Stage, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_claimbpfsubstages) ?
                    (Convert.ToInt32(s.dfa_claimbpfstages) == Convert.ToInt32(ClaimStages.Draft) ? null : GetEnumDescription((ClaimSubStages)Convert.ToInt32(s.dfa_claimbpfsubstages)))
                    : null))
                .ForMember(d => d.PaidClaimDate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_claimpaiddate) ? "(pending information)" : s.dfa_claimpaiddate));

            CreateMap<dfa_claim_retrieve, RecoveryClaim>()
                .ForMember(d => d.claimNumber, opts => opts.MapFrom(s => s.dfa_name))
                //.ForMember(d => d.claimId, opts => opts.MapFrom(s => s.dfa_projectclaimid))
                .ForMember(d => d.isThisFinalClaim, opts => opts.MapFrom(s => s.dfa_finalclaim))
                .ForMember(d => d.isFirstClaimApproved, opts => opts.MapFrom(s => s.dfa_isfirstclaim))
                .ForMember(d => d.claimEligibleGST, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totaleligiblegst) ? "0" : s.dfa_totaleligiblegst))
                .ForMember(d => d.claimTotal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totaloftotaleligible) ? "0" : s.dfa_totaloftotaleligible))
                .ForMember(d => d.approvedClaimTotal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totalapproved) ? "0" : s.dfa_totalapproved))
                .ForMember(d => d.firstClaimDeductible1000, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_lessfirst1000) ? "0" : s.dfa_lessfirst1000))
                .ForMember(d => d.approvedReimbursement, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_costsharing) ? "0" : s.dfa_costsharing))
                .ForMember(d => d.eligiblePayable, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_eligiblepayable) ? "0" : s.dfa_eligiblepayable))
                .ForMember(d => d.paidClaimAmount, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_totalpaid) ? "0" : s.dfa_totalpaid))
                .ForMember(d => d.paidClaimDate, opts => opts.MapFrom(s => s.dfa_claimpaiddate))
                .ForMember(d => d.claimReceivedByEMCRDate, opts => opts.MapFrom(s => s.dfa_claimreceiveddate))
                ;

            CreateMap<dfa_appapplication, CurrentApplication>()
                .ForMember(d => d.DateOfDamage, opts => opts.MapFrom(s => s.dfa_dateofdamage))
                .ForMember(d => d.DateOfDamageTo, opts => opts.MapFrom(s => s.dfa_dateofdamageto))
                .ForMember(d => d.ApplicationType, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_applicanttype) ? GetEnumDescription((ApplicantTypeOptionSet)Convert.ToInt32(s.dfa_applicanttype)) : null))
                .ForMember(d => d.PrimaryApplicantSignedDate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_primaryapplicantsigneddate) ? null : s.dfa_primaryapplicantsigneddate))
                .ForMember(d => d.CaseNumber, opts => opts.MapFrom(s => s.dfa_casenumber))
                .ForMember(d => d.DateFileClosed, opts => opts.MapFrom(s => s.dfa_datefileclosed))
                .ForMember(d => d.EventId, opts => opts.MapFrom(s => s.dfa_event))
                .ForMember(d => d.DamagedAddress, opts => opts.MapFrom(s => string.Join(", ", (new string[] { s.dfa_damagedpropertystreet1, s.dfa_damagedpropertycitytext }).Where(m => !string.IsNullOrEmpty(m)))))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_applicationstatusportal) ? string.Empty : s.dfa_applicationstatusportal))
                .ForMember(d => d.StatusLastUpdated, opts => opts.MapFrom(s => "01/01/2023"))
                .ForMember(d => d.wildfireDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagewildfire2 != null && s.dfa_causeofdamagewildfire2 == (int?)YesNoOptionSet.Yes ? true : false))
                .ForMember(d => d.stormDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagestorm2 != null && s.dfa_causeofdamagestorm2 == (int?)YesNoOptionSet.Yes ? true : false))
                .ForMember(d => d.floodDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageflood2 != null && s.dfa_causeofdamageflood2 == (int?)YesNoOptionSet.Yes ? true : false))
                .ForMember(d => d.landslideDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagelandslide2 != null && s.dfa_causeofdamagelandslide2 == (int?)YesNoOptionSet.Yes ? true : false))
                .ForMember(d => d.otherDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageother2 != null && s.dfa_causeofdamageother2 == (int?)YesNoOptionSet.Yes ? true : false))
                .ForMember(d => d.otherDamageText, opts => opts.MapFrom(s => s.dfa_causeofdamageloss))
                .ForMember(d => d.eligibleGST, opts => opts.MapFrom(s => s.dfa_eligiblegst))
                .ForMember(d => d.ApplicationId, opts => opts.MapFrom(s => s.dfa_appapplicationid));

            CreateMap<Controllers.Profile, ESS.Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ForMember(d => d.AuthenticatedUser, opts => opts.Ignore())
                .ForMember(d => d.VerifiedUser, opts => opts.Ignore())
                .ForMember(d => d.IsMinor, opts => opts.Ignore())
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.CellPhoneNumber))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore());

            CreateMap<dfa_appdamageditems_retrieve, DamagedRoom>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_applicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appdamageditemid))
                .ForMember(d => d.roomType, opts => opts.MapFrom(s => ConvertStringToRoomType(s.dfa_roomname)))
                .ForMember(d => d.otherRoomType, opts => opts.MapFrom(s => ConvertStringToRoomType(s.dfa_roomname) == RoomType.Other ? s.dfa_roomname : null))
                .ForMember(d => d.description, opts => opts.MapFrom(s => s.dfa_damagedescription))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<DamagedRoom, dfa_appdamageditems_params>()
                .ForMember(d => d.dfa_applicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_appdamageditemid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.dfa_roomname, opts => opts.MapFrom(s => s.roomType == RoomType.Family ? "Family" :
                        (s.roomType == RoomType.Laundry ? "Laundry" :
                        (s.roomType == RoomType.Garage ? "Garage" :
                        (s.roomType == RoomType.Other ? s.otherRoomType :
                        (s.roomType == RoomType.Kitchen ? "Kitchen" :
                        (s.roomType == RoomType.Bathroom ? "Bathroom" :
                        (s.roomType == RoomType.Bedroom ? "Bedroom" :
                        (s.roomType == RoomType.Dining ? "Dining" :
                        (s.roomType == RoomType.Living ? "Living" : "Other"))))))))))
                .ForMember(d => d.dfa_damagedescription, opts => opts.MapFrom(s => s.description))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag));

            CreateMap<dfa_event, DisasterEvent>()
                .ForMember(d => d.ninetyDayDeadline, opts => opts.MapFrom(s => s.dfa_90daydeadlinenew))
                .ForMember(d => d.remainingDays, opts => opts.MapFrom(s => (Convert.ToDateTime(s.dfa_90daydeadlinenew) - DateTime.Now).Days.ToString()))
                .ForMember(d => d.eventId, opts => opts.MapFrom(s => s.dfa_eventid))
                .ForMember(d => d.startDate, opts => opts.MapFrom(s => s.dfa_startdate))
                .ForMember(d => d.endDate, opts => opts.MapFrom(s => s.dfa_enddate))
                .ForMember(d => d.eventName, opts => opts.MapFrom(s => s.dfa_eventname))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_id));

            CreateMap<dfa_effectedregioncommunities, EffectedRegionCommunity>()
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_effectedregioncommunityid))
                .ForMember(d => d.eventId, opts => opts.MapFrom(s => s._dfa_eventid_value))
                .ForMember(d => d.communityName, opts => opts.MapFrom(s => s.dfa_areaname))
                .ForMember(d => d.regionName, opts => opts.MapFrom(s => s.dfa_name));

            CreateMap<dfa_areacommunitieses, AreaCommunity>()
                .ForMember(d => d.AreaCommunityId, opts => opts.MapFrom(s => s.dfa_areacommunitiesid))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.CommunityType, opts => opts.MapFrom(s => s.dfa_typeofcommunity));

            CreateMap<SecurityQuestion, ESS.Shared.Contracts.Events.SecurityQuestion>()
                .ReverseMap()
                ;

            CreateMap<Address, ESS.Shared.Contracts.Events.Address>()
                .ReverseMap()
                ;

            CreateMap<DFAProjectMain, dfa_project_params>()
                .ForMember(d => d.dfa_projectname, opts => opts.MapFrom(s => s.Project.projectName))
                .ForMember(d => d.dfa_applicationid, opts => opts.MapFrom(s => s.ApplicationId))
                .ForMember(d => d.dfa_projectid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.dfa_projectbusinessprocessstages, opts => opts.MapFrom(s => s.Project.projectStatus == null ? Convert.ToInt32(ProjectStages.Draft) : Convert.ToInt32(s.Project.projectStatus)))
                .ForMember(d => d.dfa_projectbusinessprocesssubstages, opts => opts.MapFrom(s => s.Project.projectStatus != null && s.Project.projectStatus.Value == ProjectStageOptionSet.SUBMIT ? Convert.ToInt32(ProjectSubStages.Pending) : (int?)null))
                //.ForMember(d => d.dfa_appcontactid, opts => opts.MapFrom(s => s.ProfileVerification.profileId))
                .ForMember(d => d.dfa_projectnumber, opts => opts.MapFrom(s => s.Project.projectNumber))
                .ForMember(d => d.dfa_dateofdamagesameasapplication, opts => opts.MapFrom(s => s.Project.isdamagedDateSameAsApplication))
                .ForMember(d => d.dfa_dateofdamagefrom, opts => opts.MapFrom(s => Convert.ToDateTime(s.Project.sitelocationdamageFromDate)))
                .ForMember(d => d.dfa_dateofdamageto, opts => opts.MapFrom(s => Convert.ToDateTime(s.Project.sitelocationdamageToDate)))
                .ForMember(d => d.dfa_dateofdamagedifferencereason, opts => opts.MapFrom(s => s.Project.differentDamageDatesReason))
                .ForMember(d => d.dfa_sitelocation, opts => opts.MapFrom(s => s.Project.siteLocation))
                .ForMember(d => d.dfa_descriptionofthecauseofdamage, opts => opts.MapFrom(s => s.Project.causeofDamageDetails))
                .ForMember(d => d.dfa_descriptionofdamagedinfrastructure, opts => opts.MapFrom(s => s.Project.infraDamageDetails))
                .ForMember(d => d.dfa_descriptionofdamage, opts => opts.MapFrom(s => s.Project.describeDamageDetails))
                .ForMember(d => d.dfa_descriptionofdamagewithmaterial, opts => opts.MapFrom(s => s.Project.describeDamagedInfrastructure))
                .ForMember(d => d.dfa_descriptionofrepairwork, opts => opts.MapFrom(s => s.Project.repairWorkDetails))
                .ForMember(d => d.dfa_descriptionofmaterialneededtorepair, opts => opts.MapFrom(s => s.Project.repairDamagedInfrastructure))
                .ForMember(d => d.dfa_estimatedcompletiondateofproject, opts => opts.MapFrom(s => Convert.ToDateTime(s.Project.estimatedCompletionDate)))
                .ForMember(d => d.dfa_estimatedcost, opts => opts.MapFrom(s => Convert.ToInt32(s.Project.estimateCostIncludingTax)));

            CreateMap<DFAClaimMain, dfa_claim_params>()
                .ForMember(d => d.dfa_finalclaim, opts => opts.MapFrom(s => s.Claim != null ? s.Claim.isThisFinalClaim : (bool?)null))
                .ForMember(d => d.dfa_projectclaimid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.dfa_claimbpfstages, opts => opts.MapFrom(s => s.Claim.claimStatus == null ? Convert.ToInt32(ClaimStages.Draft) : Convert.ToInt32(s.Claim.claimStatus)))
                .ForMember(d => d.dfa_claimbpfsubstages, opts => opts.MapFrom(s => s.Claim.claimStatus != null && s.Claim.claimStatus.Value == ClaimStageOptionSet.SUBMIT ? Convert.ToInt32(ClaimSubStages.Pending) : (int?)null))
                .ForMember(d => d.dfa_claimreceivedbyemcrdate, opts => opts.MapFrom(s => s.Claim.claimStatus != null && s.Claim.claimStatus.Value == ClaimStageOptionSet.SUBMIT ? DateTime.Now : (DateTime?)null))
                .ForMember(d => d.dfa_recoveryplanid, opts => opts.MapFrom(s => s.ProjectId));
            //.ForMember(d => d.dfa_finalclaim, opts => opts.MapFrom(s => s.ProjectId));

            CreateMap<DFAInvoiceMain, dfa_invoice_params>()
                .ForMember(d => d.dfa_receiveddatesameasinvoicedate, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.IsGoodsReceivedonInvoiceDate : (bool?)null))
                .ForMember(d => d.dfa_portionofinvoice, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.IsClaimforPartofTotalInvoice : (bool?)null))
                .ForMember(d => d.dfa_claim, opts => opts.MapFrom(s => s.ClaimId))
                .ForMember(d => d.dfa_recoveryinvoiceid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.dfa_purpose, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.PurposeOfGoodsServiceReceived : null))
                .ForMember(d => d.dfa_invoicenumber, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.InvoiceNumber : null))
                .ForMember(d => d.dfa_portioninvoicereason, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.ReasonClaimingPartofTotalInvoice : null))
                .ForMember(d => d.dfa_netinvoicedbeingclaimed, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.NetInvoiceBeingClaimed : null))
                .ForMember(d => d.dfa_pst, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.PST : null))
                .ForMember(d => d.dfa_grossgst, opts => opts.MapFrom(s => s.Invoice != null ? s.Invoice.GrossGST : null))
                .ForMember(d => d.dfa_eligiblegst, opts => opts.MapFrom(s => s.Invoice != null ? (!string.IsNullOrEmpty(s.Invoice.EligibleGST) ? s.Invoice.EligibleGST : null) : null))
                .ForMember(d => d.dfa_invoicedate, opts => opts.MapFrom(s => s.Invoice != null ? Convert.ToDateTime(s.Invoice.InvoiceDate) : (DateTime?)null))
                .ForMember(d => d.dfa_goodsorservicesreceiveddate, opts => opts.MapFrom(s => s.Invoice != null ? Convert.ToDateTime(s.Invoice.GoodsReceivedDate) : (DateTime?)null))
                .ForMember(d => d.dfa_name, opts => opts.MapFrom(s => s.Invoice.VendorName));

            CreateMap<dfa_recoveryinvoice, CurrentInvoice>()
                .ForMember(d => d.IsGoodsReceivedonInvoiceDate, opts => opts.MapFrom(s => s.dfa_receiveddatesameasinvoicedate))
                .ForMember(d => d.IsClaimforPartofTotalInvoice, opts => opts.MapFrom(s => s.dfa_portionofinvoice))
                .ForMember(d => d.ClaimId, opts => opts.MapFrom(s => s._dfa_claim_value))
                .ForMember(d => d.InvoiceId, opts => opts.MapFrom(s => s.dfa_recoveryinvoiceid))
                .ForMember(d => d.PurposeOfGoodsServiceReceived, opts => opts.MapFrom(s => s.dfa_purpose))
                .ForMember(d => d.InvoiceNumber, opts => opts.MapFrom(s => s.dfa_invoicenumber))
                .ForMember(d => d.ReasonClaimingPartofTotalInvoice, opts => opts.MapFrom(s => s.dfa_portioninvoicereason))
                .ForMember(d => d.NetInvoiceBeingClaimed, opts => opts.MapFrom(s => s.dfa_netinvoicedbeingclaimed))
                .ForMember(d => d.PST, opts => opts.MapFrom(s => s.dfa_pst))
                .ForMember(d => d.GrossGST, opts => opts.MapFrom(s => s.dfa_grossgst))
                .ForMember(d => d.InvoiceDate, opts => opts.MapFrom(s => s.dfa_invoicedate))
                .ForMember(d => d.GoodsReceivedDate, opts => opts.MapFrom(s => s.dfa_goodsorservicesreceiveddate))
                .ForMember(d => d.VendorName, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.EligibleGST, opts => opts.MapFrom(s => s.dfa_eligiblegst))
                .ForMember(d => d.ActualInvoiceTotal, opts => opts.MapFrom(s => s.dfa_actualinvoicetotal))
                .ForMember(d => d.TotalBeingClaimed, opts => opts.MapFrom(s => s.dfa_totalbeingclaimed));

            CreateMap<DFAInvoiceMain, dfa_invoice_delete_params>()
                .ForMember(d => d.dfa_recoveryinvoiceid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => true));

            CreateMap<dfa_projectmain_retrieve, RecoveryPlan>()
                .ForMember(d => d.projectNumber, opts => opts.MapFrom(s => s.dfa_projectnumber))
                .ForMember(d => d.projectName, opts => opts.MapFrom(s => s.dfa_projectname))
                .ForMember(d => d.describeDamagedInfrastructure, opts => opts.MapFrom(s => s.dfa_descriptionofdamagewithmaterial))
                .ForMember(d => d.repairWorkDetails, opts => opts.MapFrom(s => s.dfa_descriptionofrepairwork))
                .ForMember(d => d.projectStatus, opts => opts.MapFrom(s => 222710001)) //hardcoded - need to replace with s.dfa_projectbusinessprocessstages
                .ForMember(d => d.causeofDamageDetails, opts => opts.MapFrom(s => s.dfa_descriptionofthecauseofdamage))
                .ForMember(d => d.describeDamageDetails, opts => opts.MapFrom(s => s.dfa_descriptionofdamage))
                .ForMember(d => d.differentDamageDatesReason, opts => opts.MapFrom(s => s.dfa_dateofdamagedifferencereason))
                .ForMember(d => d.infraDamageDetails, opts => opts.MapFrom(s => s.dfa_descriptionofdamagedinfrastructure))
                .ForMember(d => d.repairDamagedInfrastructure, opts => opts.MapFrom(s => s.dfa_descriptionofmaterialneededtorepair))
                .ForMember(d => d.siteLocation, opts => opts.MapFrom(s => s.dfa_sitelocation))
                .ForMember(d => d.estimateCostIncludingTax, opts => opts.MapFrom(s => Convert.ToString(s.dfa_estimatedcost)))
                .ForMember(d => d.sitelocationdamageFromDate, opts => opts.MapFrom(s => s.dfa_dateofdamagefrom == null ? null : Convert.ToDateTime(s.dfa_dateofdamagefrom).ToString("o")))
                .ForMember(d => d.sitelocationdamageToDate, opts => opts.MapFrom(s => s.dfa_dateofdamageto == null ? null : Convert.ToDateTime(s.dfa_dateofdamageto).ToString("o")))
                .ForMember(d => d.isdamagedDateSameAsApplication, opts => opts.MapFrom(s => s.dfa_dateofdamagesameasapplication))
                .ForMember(d => d.estimatedCompletionDate, opts => opts.MapFrom(s => s.dfa_estimatedcompletiondateofproject == null ? null : Convert.ToDateTime(s.dfa_estimatedcompletiondateofproject).ToString("o")));
            //.ForMember(d => d.estimatedCompletionDate, opts => opts.MapFrom(s => s.dfa_estimatedcompletiondateofproject));
            //.ForMember(d => d.wildfireDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagewildfire2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagewildfire2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
            //.ForMember(d => d.landslideDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
            //.ForMember(d => d.otherDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageother2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageother2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
            //.ForMember(d => d.floodDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
            //.ForMember(d => d.guidanceSupport, opts => opts.MapFrom(s => s.dfa_receiveguidanceassessingyourinfra == (int)YesNoOptionSet.Yes ? true : (s.dfa_receiveguidanceassessingyourinfra == (int)YesNoOptionSet.No ? false : (bool?)null)))
            //.ForMember(d => d.otherDamageText, opts => opts.MapFrom(s => s.dfa_causeofdamageloss))

            //.ForMember(d => d.applicantSubtype, opts => opts.MapFrom(s => GetEnumDescription((ApplicantSubtypeCategoriesOptionSet)s.dfa_applicantsubtype).ToString()))
            //.ForMember(d => d.applicantSubSubtype, opts => opts.MapFrom(s => GetEnumDescription((ApplicantSubtypeSubCategoriesOptionSet)s.dfa_applicantlocalgovsubtype).ToString()))
            //.ForMember(d => d.subtypeOtherDetails, opts => opts.MapFrom(s => s.dfa_applicantothercomments))
            //.ForMember(d => d.estimatedPercent, opts => opts.MapFrom(s => s.dfa_estimated))
            //.ForMember(d => d.subtypeDFAComment, opts => opts.MapFrom(s => s.dfa_dfaapplicantsubtypecomments))

            //.ForMember(d => d.damageFromDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamage) ? DateTime.Parse(s.dfa_dateofdamage).ToString("o") + "Z" : s.dfa_dateofdamage))
            //.ForMember(d => d.damageToDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamageto) ? DateTime.Parse(s.dfa_dateofdamageto).ToString("o") + "Z" : s.dfa_dateofdamageto));

            // 2024-07-16 EMCRI-440 waynezen

            CreateMap<BceidUserData, bceid.BCeIDBusiness>()
                .ForMember(d => d.userId, opts => opts.MapFrom(s => s.bceid_username))
                .ForMember(d => d.legalName, opts => opts.MapFrom(s => s.bceid_business_name))
                .ForMember(d => d.contactEmail, opts => opts.MapFrom(s => s.emailaddress))
                .ForMember(d => d.individualFirstname, opts => opts.MapFrom(s => s.display_name))
                ;
        }

        public FileCategory ConvertStringToFileCategory(string documenttype)
        {
            switch (documenttype)
            {
                case "Pre Event Condition":
                    {
                        return FileCategory.PreEvent;
                    }
                case "Post Event Condition":
                    {
                        return FileCategory.PostEvent;
                    }
                case "Reports":
                    {
                        return FileCategory.Reports;
                    }
                case "Additional Supporting Documents":
                    {
                        return FileCategory.AdditionalDocuments;
                    }
                default:
                    {
                        return FileCategory.AdditionalDocuments;
                    }
            }
        }

        public FileCategoryClaim ConvertStringToFileCategoryClaim(string documenttype)
        {
            switch (documenttype)
            {
                case "Invoices":
                    {
                        return FileCategoryClaim.Invoices;
                    }
                case "General Ledger":
                    {
                        return FileCategoryClaim.GeneralLedger;
                    }
                case "Proof of Payment":
                    {
                        return FileCategoryClaim.ProofofPayment;
                    }
                case "Contracts":
                    {
                        return FileCategoryClaim.Contracts;
                    }
                case "Blue Book Rates":
                    {
                        return FileCategoryClaim.BlueBookRates;
                    }
                case "Additional Supporting Documents":
                    {
                        return FileCategoryClaim.AdditionalDocuments;
                    }
                default:
                    {
                        return FileCategoryClaim.AdditionalDocuments;
                    }
            }
        }

        public RequiredDocumentType ConvertStringToRequiredDocumentType(string requireddocumenttype)
        {
            switch (requireddocumenttype)
            {
                case "Pre Event Condition":
                    {
                        return RequiredDocumentType.PreEvent;
                    }
                case "Post Event Condition":
                    {
                        return RequiredDocumentType.PostEvent;
                    }
                default:
                    {
                        return RequiredDocumentType.PreEvent;
                    }
            }
        }

        public RequiredDocumentTypeClaim ConvertStringToRequiredDocumentTypeClaim(string requireddocumenttype)
        {
            switch (requireddocumenttype)
            {
                case "Invoices":
                    {
                        return RequiredDocumentTypeClaim.Invoices;
                    }
                case "General Ledger":
                    {
                        return RequiredDocumentTypeClaim.GeneralLedger;
                    }
                case "Proof of Payment":
                    {
                        return RequiredDocumentTypeClaim.ProofofPayment;
                    }
                default:
                    {
                        return RequiredDocumentTypeClaim.Invoices;
                    }
            }
        }

        public RoomType ConvertStringToRoomType(string roomname)
        {
            RoomType roomType = RoomType.Other;

            if (System.Enum.TryParse(roomname, out roomType)) return roomType;
            else return RoomType.Other;
        }

        public ApplicantSubtypeCategories ConvertStringToApplicantSubType(string subtype)
        {
            ApplicantSubtypeCategories roomType = ApplicantSubtypeCategories.Other;

            if (System.Enum.TryParse(subtype, out roomType)) return roomType;
            else return ApplicantSubtypeCategories.Other;
        }

        public ApplicantSubtypeCategoriesOptionSet ConvertStringToApplicantSubTypeOptionSet(string subtype)
        {
            switch (subtype)
            {
                case "First Nations Community":
                    {
                        return ApplicantSubtypeCategoriesOptionSet.FirstNationCommunity;
                    }
                case "Municipality":
                    {
                        return ApplicantSubtypeCategoriesOptionSet.Municipality;
                    }
                case "Regional District":
                    {
                        return ApplicantSubtypeCategoriesOptionSet.RegionalDistrict;
                    }
                case "Other Local Government Body":
                    {
                        return ApplicantSubtypeCategoriesOptionSet.OtherLocalGovernmentBody;
                    }
                case "Other":
                    {
                        return ApplicantSubtypeCategoriesOptionSet.Other;
                    }
                default:
                    {
                        return ApplicantSubtypeCategoriesOptionSet.FirstNationCommunity;
                    }
            }
        }

        public ApplicantSubtypeSubCategoriesOptionSet ConvertStringToApplicantSubTypeSub(string subtype)
        {
            ApplicantSubtypeSubCategories subType = ApplicantSubtypeSubCategories.Any;
            System.Enum.TryParse(subtype, out subType);
            //if (System.Enum.TryParse(subtype, out subType)) System.Enum.Parse(subType, subtype);
            //else subType = ApplicantSubtypeSubCategories.Any;

            return ConvertStringToApplicantSubTypeSubOptionSet(subtype);
        }

        public ApplicantSubtypeSubCategoriesOptionSet ConvertStringToApplicantSubTypeSubOptionSet(string subtype)
        {
            switch (subtype)
            {
                case "an improvement district as defined in the Local Government Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.ImprovementDistrict;
                    }
                case "a local area as defined in the Local Services Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.LocalArea;
                    }
                case "a greater board as defined in the Community Charter or any incorporated board that provides similar services and is incorporated by letters patent":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.GreaterBoard;
                    }
                case "a board of variance established under Division 15 of Part 14 of the Local Government Act or section 572 of the Vancouver Charter":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.BoardofVariance;
                    }
                case "the trust council, the executive committee, a local trust committee and the Islands Trust Conservancy, as these are defined in the Islands Trust Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.TrustCouncil;
                    }
                case "the Okanagan Basin Water Board":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.OkanaganBasinWaterBoard;
                    }
                case "a water users' community as defined in section 1 (1) of the Water Users' Communities Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.WaterUsersCommunity;
                    }
                case "the Okanagan-Kootenay Sterile Insect Release Board":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.OkanaganKootenaySterileInsectReleaseBoard;
                    }
                case "a municipal police board established under section 23 of the Police Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.MunicipalPoliceBoard;
                    }
                case "a library board as defined in the Library Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.LibraryBoard;
                    }
                case "any board, committee, commission, panel, agency or corporation that is created or owned by a body referred to in paragraphs (a) to (m) and all the members or officers of which are appointed or chosen by or under the authority of that body":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.Any;
                    }
                case "a board of trustees established under section 37 of the Cremation, Interment and Funeral Services Act":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.BoardofTrustees;
                    }
                case "the South Coast British Columbia Transportation Authority":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.SouthCoast;
                    }
                case "the Park Board referred to in section 485 of the Vancouver Charter":
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.ParkBoard;
                    }
                default:
                    {
                        return ApplicantSubtypeSubCategoriesOptionSet.ImprovementDistrict;
                    }
            }
        }

        public static string GetEnumDescription(System.Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[];

            if (attributes != null && attributes.Any())
            {
                return attributes.First().Description;
            }

            return value.ToString();
        }

        public string GetEnumMemberValue<T>(T value)
    where T : struct, IConvertible
        {
            return typeof(T)
                .GetTypeInfo()
                .DeclaredMembers
                .SingleOrDefault(x => x.Name == value.ToString())
                ?.GetCustomAttribute<EnumMemberAttribute>(false)
                ?.Value;
        }

        public static string GetEnumMemberByValue<T>(T value)
    where T : struct, IConvertible
        {
            return typeof(T)
                .GetTypeInfo()
                .DeclaredMembers
                .SingleOrDefault(x => x.Name == value.ToString())
                ?.GetCustomAttribute<EnumMemberAttribute>(false)
                ?.Value;
        }
    }
}
