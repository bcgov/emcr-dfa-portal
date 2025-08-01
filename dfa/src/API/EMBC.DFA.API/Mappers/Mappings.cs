using System;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Xml.Linq;

using EMBC.Database.Contract;
using EMBC.Database.Model;
using EMBC.Database.Shared.Contract;
using EMBC.DFA.API;
using EMBC.DFA.API.ConfigurationModule.Models;
using EMBC.DFA.API.ConfigurationModule.Models.Dynamics;
using EMBC.DFA.API.Controllers;

using Google.Protobuf.WellKnownTypes;

using Microsoft.AspNetCore.StaticFiles;
using Microsoft.VisualBasic;

using YamlDotNet.Core.Tokens;

using static StackExchange.Redis.Role;
using Enum = System.Enum;

namespace EMBC.DFA.API.Mappers
{
    public class Mappings : AutoMapper.Profile
    {
        private static readonly string OriginCodePortal = "931490000";

        public Mappings()
        {
            CreateMap<Profile, dfa_appcontact>()
                .ForMember(d => d.dfa_firstname, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.dfa_lastname, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.dfa_initial, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.dfa_isindigenous2, opts => opts.MapFrom(s => s.PersonalDetails.IndigenousStatus == null ? (int?)YesNoNullOptionSet.Null : (s.PersonalDetails.IndigenousStatus.ToLower() == "yes" ? (int?)YesNoNullOptionSet.Yes : (int?)YesNoNullOptionSet.No)))
                .ForMember(d => d.dfa_emailaddress, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.dfa_cellphonenumber, opts => opts.MapFrom(s => s.ContactDetails.CellPhoneNumber))
                .ForMember(d => d.dfa_residencetelephonenumber, opts => opts.MapFrom(s => s.ContactDetails.ResidencePhone))
                .ForMember(d => d.dfa_alternatephonenumber, opts => opts.MapFrom(s => s.ContactDetails.AlternatePhone))
                .ForMember(d => d.dfa_optoutofnonessentialnotifications, opts => opts.MapFrom(s => s.ContactDetails.OptOutNonEssential))
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
                .ForMember(d => d.dfa_bcservicecardid, opts => opts.MapFrom(s => s.BCServiceCardId))
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
                .ForMember(d => d.dfa_primaryapplicantprintname, opts => opts.MapFrom(s => s.signAndSubmit.applicantSignature.signedName))
                .ForMember(d => d.dfa_primaryapplicantsigneddate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.signAndSubmit.applicantSignature.dateSigned) ? null : s.signAndSubmit.applicantSignature.dateSigned.Substring(0, 10)))
                .ForMember(d => d.dfa_primaryapplicantsigned, opts => opts.MapFrom(s => s.signAndSubmit != null && string.IsNullOrEmpty(s.signAndSubmit.applicantSignature.signature) ? YesNoOptionSet.No : YesNoOptionSet.Yes))
                .ForMember(d => d.dfa_secondaryapplicantprintname, opts => opts.MapFrom(s => s.signAndSubmit.secondaryApplicantSignature.signedName))
                .ForMember(d => d.dfa_secondaryapplicantsigneddate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.signAndSubmit.secondaryApplicantSignature.dateSigned) ? null : s.signAndSubmit.secondaryApplicantSignature.dateSigned.Substring(0, 10)))
                .ForMember(d => d.dfa_secondaryapplicantsigned, opts => opts.MapFrom(s => s.signAndSubmit != null && string.IsNullOrEmpty(s.signAndSubmit.secondaryApplicantSignature.signature) ? YesNoOptionSet.No : YesNoOptionSet.Yes))
                .ForMember(d => d.dfa_causeofdamagestorm2, opts => opts.MapFrom(s => s.propertyDamage.stormDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageflood2, opts => opts.MapFrom(s => s.propertyDamage.floodDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamagelandslide2, opts => opts.MapFrom(s => s.propertyDamage.landslideDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageother2, opts => opts.MapFrom(s => s.propertyDamage.otherDamage == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No))
                .ForMember(d => d.dfa_causeofdamageloss, opts => opts.MapFrom(s => s.propertyDamage.otherDamageText))
                .ForMember(d => d.dfa_previousdfaapplicationdetails, opts => opts.MapFrom(s => s.propertyDamage.previousApplicationText))
                .ForMember(d => d.dfa_dateofdamage, opts => opts.MapFrom(s => s.propertyDamage.damageFromDate))
                .ForMember(d => d.dfa_dateofdamageto, opts => opts.MapFrom(s => s.propertyDamage.damageToDate))
                .ForMember(d => d.dfa_areyounowresidingintheresidence2, opts => opts.MapFrom(s => s.propertyDamage.residingInResidence == null ? (int?)null : (s.propertyDamage.residingInResidence == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_previousdfaapplication, opts => opts.MapFrom(s => (!string.IsNullOrEmpty(s.propertyDamage.previousApplication) ?
                                                (s.propertyDamage.previousApplication.ToLower() == PreviousApplicationOptionSet.Yes.ToString().ToLower() ? Convert.ToInt32(PreviousApplicationOptionSet.Yes) :
                                                (s.propertyDamage.previousApplication.ToLower() == PreviousApplicationOptionSet.No.ToString().ToLower() ? Convert.ToInt32(PreviousApplicationOptionSet.No) : Convert.ToInt32(PreviousApplicationOptionSet.Notsure))) : Convert.ToInt32(PreviousApplicationOptionSet.Notsure))))
                .ForMember(d => d.dfa_datereturntoresidence, opts => opts.MapFrom(s => s.propertyDamage.dateReturned))
                .ForMember(d => d.dfa_description, opts => opts.MapFrom(s => s.propertyDamage.briefDescription))
                .ForMember(d => d.dfa_doyourlossestotalmorethan10002, opts => opts.MapFrom(s => s.damagedPropertyAddress.lossesExceed1000 == null ? (int?)null : (s.damagedPropertyAddress.lossesExceed1000 == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_wereyouevacuatedduringtheevent2, opts => opts.MapFrom(s => s.propertyDamage.wereYouEvacuated == null ? (int?)null : (s.propertyDamage.wereYouEvacuated == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_damagedpropertystreet1, opts => opts.MapFrom(s => s.damagedPropertyAddress.addressLine1))
                .ForMember(d => d.dfa_damagedpropertystreet2, opts => opts.MapFrom(s => s.damagedPropertyAddress.addressLine2))
                .ForMember(d => d.dfa_damagedpropertycitytext, opts => opts.MapFrom(s => s.damagedPropertyAddress.community))
                .ForMember(d => d.dfa_damagedpropertypostalcode, opts => opts.MapFrom(s => s.damagedPropertyAddress.postalCode))
                .ForMember(d => d.dfa_damagedpropertyprovince, opts => opts.MapFrom(s => s.damagedPropertyAddress.stateProvince))
                .ForMember(d => d.dfa_isthispropertyyourp2, opts => opts.MapFrom(s => s.damagedPropertyAddress.occupyAsPrimaryResidence == null ? (int?)null : (s.damagedPropertyAddress.occupyAsPrimaryResidence == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_indigenousreserve2, opts => opts.MapFrom(s => s.damagedPropertyAddress.onAFirstNationsReserve == null ? (int?)null : (s.damagedPropertyAddress.onAFirstNationsReserve == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_nameoffirstnationsr, opts => opts.MapFrom(s => s.damagedPropertyAddress.firstNationsReserve))
                .ForMember(d => d.dfa_manufacturedhom2, opts => opts.MapFrom(s => s.damagedPropertyAddress.manufacturedHome == null ? (int?)null : (s.damagedPropertyAddress.manufacturedHome == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_eligibleforbchomegrantonthisproperty2, opts => opts.MapFrom(s => s.damagedPropertyAddress.eligibleForHomeOwnerGrant == null ? (int?)null : (s.damagedPropertyAddress.eligibleForHomeOwnerGrant == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_contactfirstname, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordGivenNames))
                .ForMember(d => d.dfa_contactfirstname2, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordGivenNames2))
                .ForMember(d => d.dfa_contactlastname, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordSurname))
                .ForMember(d => d.dfa_contactlastname2, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordSurname2))
                .ForMember(d => d.dfa_contactphone1, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordPhone))
                .ForMember(d => d.dfa_contactphone2, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordPhone2))
                .ForMember(d => d.dfa_contactemail, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordEmail))
                .ForMember(d => d.dfa_contactemai2, opts => opts.MapFrom(s => s.damagedPropertyAddress.landlordEmail2))
                .ForMember(d => d.dfa_havereceiptsforcleanupsorrepairs2, opts => opts.MapFrom(s => s.cleanUpLog.haveInvoicesOrReceiptsForCleanupOrRepairs == null ? (int?)null : (s.cleanUpLog.haveInvoicesOrReceiptsForCleanupOrRepairs == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_acopyofarentalagreementorlease2, opts => opts.MapFrom(s => s.supportingDocuments.hasCopyOfARentalAgreementOrLease == null ? (int?)null : (s.supportingDocuments.hasCopyOfARentalAgreementOrLease == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_isprimaryanddamagedaddresssame2, opts => opts.MapFrom(s => s.damagedPropertyAddress.isPrimaryAndDamagedAddressSame == null ? (int?)null : (s.damagedPropertyAddress.isPrimaryAndDamagedAddressSame == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_charityregistered, opts => opts.MapFrom(s => s.damagedPropertyAddress.charityRegistered == null ? (int?)null : (s.damagedPropertyAddress.charityRegistered == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_charityexistsatleast12months, opts => opts.MapFrom(s => s.damagedPropertyAddress.charityExistsAtLeast12Months == null ? (int?)null : (s.damagedPropertyAddress.charityExistsAtLeast12Months == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_charityprovidescommunitybenefit, opts => opts.MapFrom(s => s.damagedPropertyAddress.charityProvidesCommunityBenefit == null ? (int?)null : (s.damagedPropertyAddress.charityProvidesCommunityBenefit == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_businessmanagedbyallownersondaytodaybasis, opts => opts.MapFrom(s => s.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis == null ? (int?)null : (s.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_grossrevenues100002000000beforedisaster, opts => opts.MapFrom(s => s.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster == null ? (int?)null : (s.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_employlessthan50employeesatanyonetime, opts => opts.MapFrom(s => s.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime == null ? (int?)null : (s.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_farmoperation, opts => opts.MapFrom(s => s.damagedPropertyAddress.farmoperation == null ? (int?)null : (s.damagedPropertyAddress.farmoperation == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_ownedandoperatedbya, opts => opts.MapFrom(s => s.damagedPropertyAddress.ownedandoperatedbya == null ? (int?)null : (s.damagedPropertyAddress.ownedandoperatedbya == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_farmoperationderivesthatpersonsmajorincom, opts => opts.MapFrom(s => s.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom == null ? (int?)null : (s.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_accountlegalname, opts => opts.MapFrom(s => s.damagedPropertyAddress.businessLegalName))
                .ForMember(d => d.dfa_damagedpropertyaddresscanadapostverified, opts => opts.MapFrom(s => s.damagedPropertyAddress.isDamagedAddressVerified == null ? (int?)null : (s.damagedPropertyAddress.isDamagedAddressVerified == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_iamtheonlypersoninthehome, opts => opts.MapFrom(s => s.onlyOccupantInHome == false ? (int?)YesNoOptionSet.No : (int?)YesNoOptionSet.Yes))
                .ForMember(d => d.dfa_idonthaveanothercontact, opts => opts.MapFrom(s => s.onlyOtherContact == false ? (int?)YesNoOptionSet.No : (int?)YesNoOptionSet.Yes))
                .ForMember(d => d.delete, opts => opts.MapFrom(s => s.deleteFlag))
                .ForMember(d => d.dfa_applicanttype, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.ApplicationType) ? GetEnumDescription((ApplicantTypeOptionSet)Convert.ToInt32(s.ApplicationType)) : null));

            CreateMap<DFAApplicationMain, temp_dfa_appapplicationmain_params>() // TODO: map into dfa_application_params when dynamics process updated
                .ForMember(d => d.dfa_businessmanagedbyallownersondaytodaybasis, opts => opts.MapFrom(s => s.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis == null ? (int?)null : (s.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_grossrevenues100002000000beforedisaster, opts => opts.MapFrom(s => s.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster == null ? (int?)null : (s.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_employlessthan50employeesatanyonetime, opts => opts.MapFrom(s => s.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime == null ? (int?)null : (s.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_farmoperation, opts => opts.MapFrom(s => s.damagedPropertyAddress.farmoperation == null ? (int?)null : (s.damagedPropertyAddress.farmoperation == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_ownedandoperatedbya, opts => opts.MapFrom(s => s.damagedPropertyAddress.ownedandoperatedbya == null ? (int?)null : (s.damagedPropertyAddress.ownedandoperatedbya == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_farmoperationderivesthatpersonsmajorincom, opts => opts.MapFrom(s => s.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom == null ? (int?)null : (s.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom == true ? (int?)YesNoOptionSet.Yes : (int?)YesNoOptionSet.No)))
                .ForMember(d => d.dfa_accountlegalname, opts => opts.MapFrom(s => s.damagedPropertyAddress.businessLegalName));

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
                .ForMember(d => d.landlordGivenNames2, opts => opts.MapFrom(s => s.dfa_contactfirstname2))
                .ForMember(d => d.landlordSurname, opts => opts.MapFrom(s => s.dfa_contactlastname))
                .ForMember(d => d.landlordSurname2, opts => opts.MapFrom(s => s.dfa_contactlastname2))
                .ForMember(d => d.landlordPhone, opts => opts.MapFrom(s => s.dfa_contactphone1))
                .ForMember(d => d.landlordPhone2, opts => opts.MapFrom(s => s.dfa_contactphone2))
                .ForMember(d => d.landlordEmail, opts => opts.MapFrom(s => s.dfa_contactemail))
                .ForMember(d => d.landlordEmail2, opts => opts.MapFrom(s => s.dfa_contactemail2))
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
                .ForMember(d => d.landslideDamage, opts => opts.MapFrom(s => s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamagelandslide2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.otherDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageother2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageother2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.floodDamage, opts => opts.MapFrom(s => s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_causeofdamageflood2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.otherDamageText, opts => opts.MapFrom(s => s.dfa_causeofdamageloss))
                .ForMember(d => d.previousApplicationText, opts => opts.MapFrom(s => s.dfa_previousdfaapplicationdetails))
                .ForMember(d => d.previousApplication, opts => opts.MapFrom(s => s.dfa_previousdfaapplication != null ? GetEnumDescription((PreviousApplicationOptionSet)Convert.ToInt32(s.dfa_previousdfaapplication)) : null))
                .ForMember(d => d.damageFromDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamage) ? DateTime.Parse(s.dfa_dateofdamage).ToString("o") + "Z" : s.dfa_dateofdamage))
                .ForMember(d => d.damageToDate, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_dateofdamageto) ? DateTime.Parse(s.dfa_dateofdamageto).ToString("o") + "Z" : s.dfa_dateofdamageto))
                .ForMember(d => d.residingInResidence, opts => opts.MapFrom(s => s.dfa_areyounowresidingintheresidence2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_areyounowresidingintheresidence2 == (int)YesNoOptionSet.No ? false : (bool?)null)))
                .ForMember(d => d.dateReturned, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_datereturntotheresidence) ? DateTime.Parse(s.dfa_datereturntotheresidence).ToString("o") + "Z" : s.dfa_datereturntotheresidence))
                .ForMember(d => d.briefDescription, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.wereYouEvacuated, opts => opts.MapFrom(s => s.dfa_wereyouevacuatedduringtheevent2 == (int)YesNoOptionSet.Yes ? true : (s.dfa_wereyouevacuatedduringtheevent2 == (int)YesNoOptionSet.No ? false : (bool?)null)));

            CreateMap<dfa_appapplicationmain_retrieve, EMBC.DFA.API.Controllers.SignAndSubmit>()
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

            CreateMap<dfa_appdocumentlocation, FileUpload>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_applicationid_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.dfa_appdocumentlocationsid))
                .ForMember(d => d.fileName, opts => opts.MapFrom(s => s.dfa_name))
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => ConvertStringToFileCategory(s.dfa_documenttype)))
                .ForMember(d => d.requiredDocumentType, opts => opts.MapFrom(s => ConvertStringToRequiredDocumentType(s.dfa_requireddocumenttype)))
                .ForMember(d => d.fileDescription, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.uploadedDate, opts => opts.MapFrom(s => s.createdon))
                .ForMember(d => d.modifiedBy, opts => opts.MapFrom(s => s.dfa_modifiedby))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<FileUpload, AttachmentEntity>()
                .ForMember(d => d.filename, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.activitysubject, opts => opts.MapFrom(s => "dfa_appapplication"))
                .ForMember(d => d.subject, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.fileDescription) ? s.fileName : s.fileDescription))
                .ForMember(d => d.body, opts => opts.MapFrom(s => s.fileData));

            CreateMap<FileUpload, SubmissionEntity>()
                .ForMember(d => d.dfa_appapplicationid, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.dfa_description, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.dfa_modifiedby, opts => opts.MapFrom(s => s.modifiedBy))
                .ForMember(d => d.dfa_requireddocumenttype, opts => opts.MapFrom(s => s.requiredDocumentType)) // TODO map required file type
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => s.fileType));

            CreateMap<bcgov_documenturl, FileUpload>()
                .ForMember(d => d.applicationId, opts => opts.MapFrom(s => s._dfa_appapplication_value))
                .ForMember(d => d.id, opts => opts.MapFrom(s => s.bcgov_documenturlid))
                .ForMember(d => d.fileName, opts => opts.MapFrom(s => s.bcgov_filename))
                .ForMember(d => d.fileType, opts => opts.MapFrom(s => ConvertStringToFileCategory(s.dfa_category)))
                .ForMember(d => d.requiredDocumentType, opts => opts.MapFrom(s => ConvertStringToRequiredDocumentType(s.dfa_requireddocumenttype)))
                .ForMember(d => d.fileDescription, opts => opts.MapFrom(s => s.dfa_description))
                .ForMember(d => d.fileSize, opts => opts.MapFrom(s => s.bcgov_size))
                .ForMember(d => d.uploadedDate, opts => opts.MapFrom(s => s.createdon))
                .ForMember(d => d.modifiedBy, opts => opts.MapFrom(s => s._modifiedby_value))
                .ForMember(d => d.contentType, opts => opts.MapFrom(s => s.bcgov_mimetype))
                .ForMember(d => d.deleteFlag, opts => opts.MapFrom(s => false));

            CreateMap<FileUpload, bcgov_documenturl>()
                .ForMember(d => d._dfa_appapplication_value, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.bcgov_documenturlid, opts => opts.MapFrom(s => s.id))
                .ForMember(d => d.bcgov_filename, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.dfa_category, opts => opts.MapFrom(s => s.fileType))
                .ForMember(d => d.dfa_requireddocumenttype, opts => opts.MapFrom(s => s.requiredDocumentType.ToString()))
                .ForMember(d => d.dfa_description, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.bcgov_size, opts => opts.MapFrom(s => s.fileSize))
                .ForMember(d => d.createdon, opts => opts.MapFrom(s => s.uploadedDate))
                .ForMember(d => d._modifiedby_value, opts => opts.MapFrom(s => s.modifiedBy))
                .ForMember(d => d.bcgov_mimetype, opts => opts.MapFrom(s => s.contentType));

            CreateMap<FileUpload, MetadataSubmissionEntity>()
                .ForMember(d => d.RegardingEntityID, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.OriginCode, opts => opts.MapFrom(s => OriginCodePortal))
                .ForMember(d => d.Metadata_1, opts => opts.MapFrom(s => s.fileType)) // category
                .ForMember(d => d.Metadata_2, opts => opts.MapFrom(s => s.requiredDocumentType))
                .ForMember(d => d.Metadata_3, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.DocumentSize, opts => opts.MapFrom(s => s.fileSize))
                .ForMember(d => d.ReceivedDate, opts => opts.MapFrom(s => s.uploadedDate))
                .ForMember(d => d.DocumentFileName, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.MimeType, opts => opts.MapFrom(s => s.contentType))
                ;

            CreateMap<FileUpload, S3SubmissionEntity>()
                .ForMember(d => d.RegardingEntityID, opts => opts.MapFrom(s => s.applicationId))
                .ForMember(d => d.OriginCode, opts => opts.MapFrom(s => OriginCodePortal))
                .ForMember(d => d.Metadata_1, opts => opts.MapFrom(s => s.fileType))
                .ForMember(d => d.Metadata_2, opts => opts.MapFrom(s => s.requiredDocumentType))
                .ForMember(d => d.Metadata_3, opts => opts.MapFrom(s => s.fileDescription))
                .ForMember(d => d.DocumentSize, opts => opts.MapFrom(s => s.fileSize))
                .ForMember(d => d.ReceivedDate, opts => opts.MapFrom(s => s.uploadedDate))
                .ForMember(d => d.DocumentFileName, opts => opts.MapFrom(s => s.fileName))
                .ForMember(d => d.MimeType, opts => opts.MapFrom(s => s.contentType))
                .ForMember(d => d.DocumentContent, opts => opts.MapFrom(s => s.fileData))
                ;

            CreateMap<AppealFileMetadataUpload, DocumentUrl>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.AppealId, opts => opts.MapFrom(s => s.AppealId))
                .ForMember(d => d.FileName, opts => opts.MapFrom(s => s.FileName))
                .ForMember(d => d.Url, opts => opts.MapFrom(s => s.Url))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Description))
                .ForMember(d => d.Category, opts => opts.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.Size, opts => opts.MapFrom(s => s.Size))
                .ForMember(d => d.MimeType, opts => opts.MapFrom(s => s.MimeType))
                .ForMember(d => d.UploadedDate, opts => opts.MapFrom(s => s.UploadedDate));

            CreateMap<DocumentUrl, AppealFileMetadataUpload>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.AppealId, opts => opts.MapFrom(s => s.AppealId))
                .ForMember(d => d.FileName, opts => opts.MapFrom(s => s.FileName))
                .ForMember(d => d.Url, opts => opts.MapFrom(s => s.Url))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Description))
                .ForMember(d => d.Category, opts => opts.MapFrom(s => ConvertStringToFileCategory(s.Category)))
                .ForMember(d => d.Size, opts => opts.MapFrom(s => s.Size))
                .ForMember(d => d.MimeType, opts => opts.MapFrom(s => s.MimeType))
                .ForMember(d => d.UploadedDate, opts => opts.MapFrom(s => s.UploadedDate));

            CreateMap<AppealFileMetadataUpload, BcGoV_DocumentUrl>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.DFA_AppealId, opts => opts.MapFrom(s => s.AppealId))
                .ForMember(d => d.BcGoV_Filename, opts => opts.MapFrom(s => s.FileName))
                .ForMember(d => d.BcGoV_Url, opts => opts.MapFrom(s => s.Url))
                .ForMember(d => d.DFA_Description, opts => opts.MapFrom(s => s.Description))
                .ForMember(d => d.DFA_Category, opts => opts.MapFrom(s => s.Category.ToString()))
                .ForMember(d => d.BcGoV_Size, opts => opts.MapFrom(s => s.Size))
                .ForMember(d => d.BcGoV_MimeType, opts => opts.MapFrom(s => s.MimeType))
                .ForMember(d => d.DFA_DateUploaded, opts => opts.MapFrom(s => s.UploadedDate));

            CreateMap<BcGoV_DocumentUrl, AppealFileMetadataUpload>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.AppealId, opts => opts.MapFrom(s => s.DFA_AppealId))
                .ForMember(d => d.FileName, opts => opts.MapFrom(s => s.BcGoV_Filename))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.DFA_Description))
                .ForMember(d => d.Url, opts => opts.MapFrom(s => s.BcGoV_Url))
                .ForMember(d => d.Category, opts => opts.MapFrom(s => ConvertStringToFileCategory(s.DFA_Category)))
                .ForMember(d => d.Size, opts => opts.MapFrom(s => s.BcGoV_Size))
                .ForMember(d => d.MimeType, opts => opts.MapFrom(s => s.BcGoV_MimeType))
                .ForMember(d => d.UploadedDate, opts => opts.MapFrom(s => s.DFA_DateUploaded));

            CreateMap<dfa_appapplication, CurrentApplication>()
                .ForMember(d => d.DateOfDamage, opts => opts.MapFrom(s => s.dfa_dateofdamage))
                .ForMember(d => d.ApplicationType, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_applicanttype) ? GetEnumDescription((ApplicantTypeOptionSet)Convert.ToInt32(s.dfa_applicanttype)) : null))
                .ForMember(d => d.ApplicationSubType, opts => opts.MapFrom(s => s.dfa_smallbusinesstype != null ?
                " - " + GetEnumDescription((SmallBusinessOptionSet)Convert.ToInt32(s.dfa_smallbusinesstype)) :
                (s.dfa_farmtype != null ? " - " + GetEnumDescription((FarmOptionSet)Convert.ToInt32(s.dfa_farmtype)) : string.Empty)))
                .ForMember(d => d.PrimaryApplicantSignedDate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_primaryapplicantsigneddate) ? null : s.dfa_primaryapplicantsigneddate))
                .ForMember(d => d.CaseId, opts => opts.MapFrom(s => s.dfa_caseid))
                .ForMember(d => d.CaseNumber, opts => opts.MapFrom(s => s.dfa_casenumber))
                .ForMember(d => d.LegalName, opts => opts.MapFrom(s => s.dfa_accountlegalname))
                .ForMember(d => d.DateFileClosed, opts => opts.MapFrom(s => s.dfa_datefileclosed))
                .ForMember(d => d.DateAppealClosed, opts => opts.MapFrom(s => s.dfa_appealcloseddate))
                .ForMember(d => d.EventId, opts => opts.MapFrom(s => s.dfa_event))
                .ForMember(d => d.DamagedAddress, opts => opts.MapFrom(s => string.Join(", ", (new string[] { s.dfa_damagedpropertystreet1, s.dfa_damagedpropertycitytext }).Where(m => !string.IsNullOrEmpty(m)))))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.dfa_applicationstatusportal) ? string.Empty : s.dfa_applicationstatusportal))
                .ForMember(d => d.StatusLastUpdated, opts => opts.MapFrom(s => "01/01/2023"))
                .ForMember(d => d.ApplicationId, opts => opts.MapFrom(s => s.dfa_appapplicationid))
                .ForMember(d => d.CaseEligibilityAppeal, opts => opts.MapFrom(s => s.CaseEligibilityAppeal))
                .ForMember(d => d.CaseAmountAppeal, opts => opts.MapFrom(s => s.CasePaidAmountAppeal))
                .ForMember(d => d.CaseEligibility, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_eligibilitystatus) ? GetEnumDescription((CaseEligibilityOptionSet)Convert.ToInt32(s.dfa_eligibilitystatus)) : null))
                .ForMember(d => d.AmountAppealPortalNote, opts => opts.MapFrom(s => s.AmountAppealPortalNote))
                .ForMember(d => d.AmountAppealStatusPortal, opts => opts.MapFrom(s => s.AmountAppealStatusPortal));

            CreateMap<DFA_CaseEligibilityAppeal, CaseEligibilityAppeal>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (int)src.StateCode))
                .ForMember(dest => dest.CaseAppealId, opt => opt.MapFrom(src => src.Bpf_DFA_AppealId.Id))
                .AfterMap((src, dest) => dest.Stages = src.TraversedPath?.Split(",").Select(x => new Stage { Id = new Guid(x), Name = string.Empty }).ToArray());

            CreateMap<DFA_CasePaidAmountAppeal, CasePaidAmountAppeal>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.StateCode, opt => opt.MapFrom(src => (StateCode)(int)src.StateCode))
                .ForMember(dest => dest.CaseAppealId, opt => opt.MapFrom(src => src.Bpf_DFA_AppealId.Id))
                .AfterMap((src, dest) => dest.Stages = src.TraversedPath?.Split(",").Select(x => new Stage { Id = new Guid(x), Name = string.Empty }).ToArray());

            CreateMap<dfa_incident_retrieve, CurrentCase>()
                .ForMember(dest => dest.CaseId, opts => opts.MapFrom(src => src.incidentid))
                .ForMember(dest => dest.CaseEligibility, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.dfa_eligibilitystatus) ? GetEnumDescription((CaseEligibilityOptionSet)Convert.ToInt32(s.dfa_eligibilitystatus)) : null))
                .ForMember(d => d.CaseNumber, opts => opts.MapFrom(s => s.ticketnumber));

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
                .ForMember(d => d.remainingDays, opts => opts.MapFrom(s => (Convert.ToDateTime(s.dfa_90daydeadlinenew).Date - DateTime.Now.Date).Days.ToString()))
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

            //Mapping from AppealModel (API Model) to Appeal (DTO API Layer)
            CreateMap<AppealModel, Appeal>()
                .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.CaseId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason))
                .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.Signature, opt => opt.MapFrom(src => src.Signature))
                .ForMember(dest => dest.DateSigned, opt => opt.MapFrom(src => src.DateSigned))
                 .ForMember(dest => dest.SignedName, opt => opt.MapFrom(src => src.SignedName));

            CreateMap<AppealUpdateRequest, Appeal>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.CaseId, opt => opt.MapFrom(src => src.CaseId))
               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
               .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason))
               .ForMember(dest => dest.AppealType, opt => opt.MapFrom(src => src.Type.ToString()))
               .ForMember(dest => dest.Signature, opt => opt.MapFrom(src => src.Signature))
               .ForMember(dest => dest.DateSigned, opt => opt.MapFrom(src => src.DateSigned))
               .ForMember(dest => dest.SignedName, opt => opt.MapFrom(src => src.SignedName));

            // Fully qualify the destination type for SignAndSubmit and DigitalSignature:
            CreateMap<SignAndSubmitModel, EMBC.Database.Contract.SignAndSubmit>()
                .ForMember(dest => dest.ApplicantSignature, opt => opt.MapFrom(src => src.ApplicantSignature))
                .ForMember(dest => dest.SecondaryApplicantSignature, opt => opt.MapFrom(src => src.SecondaryApplicantSignature));

            CreateMap<SignatureBlock, EMBC.Database.Contract.DigitalSignature>()
                .ForMember(dest => dest.Signature, opt => opt.MapFrom(src => src.signature))
                .ForMember(dest => dest.SignedName, opt => opt.MapFrom(src => src.signedName))
                .ForMember(dest => dest.DateSigned, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.dateSigned) ? DateTime.MinValue : DateTime.Parse(src.dateSigned)));

            // Mapping from Appeal DTO/API Layer to Appeal Model
            CreateMap<Appeal, AppealModel>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.AppealType));
                
            CreateMap<EMBC.Database.Contract.SignAndSubmit, SignAndSubmitModel>();

            CreateMap<DigitalSignature, SignatureBlock>()
                .ForMember(dest => dest.signature, opt => opt.MapFrom(src => src.Signature))
                .ForMember(dest => dest.dateSigned, opt => opt.MapFrom(src => src.DateSigned))
                .ForMember(dest => dest.signedName, opt => opt.MapFrom(src => src.SignedName));

        }

        public FileCategory ConvertStringToFileCategory(string documenttype)
        {
            switch (documenttype)
            {
                case "Cleanup":
                    {
                        return FileCategory.Cleanup;
                    }
                case "Appeal":
                    {
                        return FileCategory.Appeal;
                    }
                case "Financial":
                    {
                        return FileCategory.Financial;
                    }
                case "Insurance":
                    {
                        return FileCategory.Insurance;
                    }
                case "Third party consent":
                    {
                        return FileCategory.ThirdPartyConsent;
                    }
                case "Tenancy proof":
                    {
                        return FileCategory.TenancyProof;
                    }
                case "Damage photo":
                    {
                        return FileCategory.DamagePhoto;
                    }
                default:
                    {
                        return FileCategory.Unknown;
                    }
            }
        }
        public RequiredDocumentType ConvertStringToRequiredDocumentType(string requireddocumenttype)
        {
            switch (requireddocumenttype)
            {
                case "Identification":
                    {
                        return RequiredDocumentType.Identification;
                    }
                case "Insurance Template":
                    {
                        return RequiredDocumentType.InsuranceTemplate;
                    }
                case "Tenancy Agreement":
                    {
                        return RequiredDocumentType.TenancyAgreement;
                    }
                case "Residential Tenancy Agreement":
                    {
                        return RequiredDocumentType.ResidentialTenancyAgreement;
                    }
                case "T1 General Income Tax Return":
                    {
                        return RequiredDocumentType.T1GeneralIncomeTaxReturn;
                    }
                case "T2 Corporate Income Tax Return":
                    {
                        return RequiredDocumentType.T2CorporateIncomeTaxReturn;
                    }
                case "Financial Statements":
                    {
                        return RequiredDocumentType.FinancialStatements;
                    }
                case "Proof of Ownership":
                    {
                        return RequiredDocumentType.ProofOfOwnership;
                    }
                case "T776 Statement of Real Estate Rentals":
                    {
                        return RequiredDocumentType.T776;
                    }
                case "Directors Listing":
                    {
                        return RequiredDocumentType.DirectorsListing;
                    }
                case "Registration Proof":
                    {
                        return RequiredDocumentType.RegistrationProof;
                    }
                case "Structure and Purpose":
                    {
                        return RequiredDocumentType.StructureAndPurpose;
                    }
                default:
                    {
                        return RequiredDocumentType.Unknown;
                    }
            }
        }

        public RoomType ConvertStringToRoomType(string roomname)
        {
            RoomType roomType = RoomType.Other;

            if (System.Enum.TryParse(roomname, out roomType)) return roomType;
            else return RoomType.Other;
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
    }
}
