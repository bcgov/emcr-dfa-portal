using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Org.BouncyCastle.Asn1.Mozilla;

namespace EMBC.DFA.API.Controllers
{
    /// <summary>
    /// Address data with optional lookup code
    /// </summary>
    public class Address
    {
        public string? AddressLine1 { get; set; }

        public string? AddressLine2 { get; set; }

        public string? City { get; set; }

        public string? StateProvince { get; set; }

        public string? PostalCode { get; set; }
        public bool? isAddressVerified { get; set; }
    }

    /// <summary>
    /// Profile personal details
    /// </summary>
    public class PersonDetails
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string? Initials { get; set; }
        public string? IndigenousStatus { get; set; }
    }

    /// <summary>
    /// Profile contact information
    /// </summary>
    public class ContactDetails
    {
        //[EmailAddress]
        public string Email { get; set; }

        //[Phone]
        public string? ResidencePhone { get; set; }

        public string? CellPhoneNumber { get; set; }

        public string? AlternatePhone { get; set; }

        public bool? OptOutNonEssential { get; set; }
    }

    /// <summary>
    /// Profile security questions
    /// </summary>
    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool AnswerChanged { get; set; }
    }

    /// <summary>
    /// Application consent
    /// </summary>
    public class Consent
    {
        public bool consent { get; set; }
    }

    /// <summary>
    /// Profile Verification
    /// </summary>
    public class ProfileVerification
    {
        public bool profileVerified { get; set; }
        public string? profileId { get; set; }
        public Profile? profile { get; set; }
    }

    /// <summary>
    /// Application Type and Insurance
    /// </summary>
    public class AppTypeInsurance
    {
        public ApplicantOption applicantOption { get; set; }
        public InsuranceOption insuranceOption { get; set; }
        public SmallBusinessOption? smallBusinessOption { get; set; }
        public FarmOption? farmOption { get; set; }
        public SignatureBlock? applicantSignature { get; set; }
        public SignatureBlock? secondaryApplicantSignature { get; set; }
    }

    /// <summary>
    /// Signature Block
    /// </summary>
    public class SignatureBlock
    {
        public string? dateSigned { get; set; }
        public string? signedName { get; set; }
        public string? signature { get; set; }
    }

    /// <summary>
    /// PreScreeningQuestions
    /// </summary>
    public class OtherPreScreeningQuestions
    {
        public string? addressLine1 { get; set; }
        public string? addressLine2 { get; set; }
        public string? city { get; set; }
        public string? postalCode { get; set; }
        public string? stateProvince { get; set; }
        public bool? isPrimaryAndDamagedAddressSame { get; set; }
        public string? damageFromDate { get; set; }
        public bool? lossesExceed1000 { get; set; }
        public bool? damageCausedByDisaster { get; set; }
        public string? eventId { get; set; }
        public bool? isDamagedAddressVerified { get; set; }
    }

    /// <summary>
    /// Insurance Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum InsuranceOption
    {
        [EnumMember(Value = "Yes, my insurance will cover all my losses.")]
        Yes,

        [EnumMember(Value = "Yes, but I don\'t know if my insurance will cover all damages or for this event.")]
        Unsure,

        [EnumMember(Value = "No")]
        No
    }

    /// <summary>
    /// Applicant Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ApplicantOption
    {
        [EnumMember(Value = "Homeowner")]
        Homeowner,

        [EnumMember(Value = "Residential Tenant")]
        ResidentialTenant,

        [EnumMember(Value = "Small Business Owner")]
        SmallBusinessOwner,

        [EnumMember(Value = "Farm Owner")]
        FarmOwner,

        [EnumMember(Value = "Charitable Organization")]
        CharitableOrganization
    }

    /// <summary>
    /// Farm Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FarmOption
    {
        [EnumMember(Value = "General Partnership, Sole Proprietorship, Unregistered, or DBA Name")]
        General,

        [EnumMember(Value = "Corporate Company (Ltd./Inc.)")]
        Corporate,
    }

    /// <summary>
    /// Small Business Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SmallBusinessOption
    {
        [EnumMember(Value = "General or Sole Proprietorship or DBA name")]
        General,

        [EnumMember(Value = "Corporate Company (Ltd./Inc.)")]
        Corporate,

        [EnumMember(Value = "Landlord")]
        Landlord,
    }

    /// <summary>
    /// Secondary Applicant Type Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SecondaryApplicantTypeOption
    {
        [EnumMember(Value = "Contact")]
        Contact,

        [EnumMember(Value = "Organization")]
        Organization,
    }

    /// <summary>
    /// File Category Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FileCategory
    {
        [EnumMember(Value = "Insurance")]
        Insurance,

        [EnumMember(Value = "Financial")]
        Financial,

        [EnumMember(Value = "Third party consent")]
        ThirdPartyConsent,

        [EnumMember(Value = "Tenancy proof")]
        TenancyProof,

        [EnumMember(Value = "Damage photo")]
        DamagePhoto,

        [EnumMember(Value = "Cleanup")]
        Cleanup,

        [EnumMember(Value = "Appeal")]
        Appeal,

        [EnumMember(Value = "Unknown")]
        Unknown
    }

    /// <summary>
    /// File Category Options
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RequiredDocumentType
    {
        [EnumMember(Value = "Identification")] // Tenancy Proof for Residential Tenant
        Identification,

        [EnumMember(Value = "Insurance Template")] // Insurance Category for Homeowner, Residential Tenant, Small Business General or Sole or Corporate Company or Landlord, Farm General or Sole or Corporate, Charity
        InsuranceTemplate,

        [EnumMember(Value = "Tenancy Agreement")] // Tenancy proof for Residential Tenant
        TenancyAgreement,

        [EnumMember(Value = "Residential Tenancy Agreement")] // Tenancy proof for Small Business Landlord
        ResidentialTenancyAgreement,

        [EnumMember(Value = "T1 General Income Tax Return")] // Financial for Small Business General or Sole or Landlord, Farm General or Sole
        T1GeneralIncomeTaxReturn,

        [EnumMember(Value = "T2 Corporate Income Tax Return")] // Financial for Small Business Corporate Company, Farm Corporate
        T2CorporateIncomeTaxReturn,

        [EnumMember(Value = "Financial Statements")] // Financial for Small Business General or Sole or Corporate Company, Farm General or Sole or Corporate
        FinancialStatements,

        [EnumMember(Value = "Proof of Ownership")] // Financial for Small Business Corporate Company, Farm Corporate
        ProofOfOwnership,

        [EnumMember(Value = "T776 Statement of Real Estate Rentals")] // Financial for Small Business Landlord
        T776,

        [EnumMember(Value = "Directors Listing")] // Financial for Charity
        DirectorsListing,

        [EnumMember(Value = "Registration Proof")] // Financial for Charity
        RegistrationProof,

        [EnumMember(Value = "Structure and Purpose")] // Financial for Charity
        StructureAndPurpose,

        [EnumMember(Value = "Unknown")] // Unknown
        Unknown
    }

    /// <summary>
    /// Room Types
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RoomType
    {
        [EnumMember(Value = "Bathroom")]
        Bathroom,

        [EnumMember(Value = "Bedroom")]
        Bedroom,

        [EnumMember(Value = "Dining room")]
        Dining,

        [EnumMember(Value = "Family room")]
        Family,

        [EnumMember(Value = "Garage")]
        Garage,

        [EnumMember(Value = "Kitchen")]
        Kitchen,

        [EnumMember(Value = "Laundry room")]
        Laundry,

        [EnumMember(Value = "Living room")]
        Living,

        [EnumMember(Value = "Other")]
        Other
    }

    /// <summary>
    /// Damaged Property Address
    /// </summary>
    public class DamagedPropertyAddress
    {
        public string? addressLine1 { get; set; }
        public string? addressLine2 { get; set; }
        public string? community { get; set; }
        public string? postalCode { get; set; }
        public string? stateProvince { get; set; }
        public bool? occupyAsPrimaryResidence { get; set; }
        public bool? onAFirstNationsReserve { get; set; }
        public string? firstNationsReserve { get; set; }
        public bool? manufacturedHome { get; set; }
        public bool? eligibleForHomeOwnerGrant { get; set; }
        public string? landlordGivenNames { get; set; }
        public string? landlordGivenNames2 { get; set; }
        public string? landlordSurname { get; set; }
        public string? landlordSurname2 { get; set; }
        public string? landlordPhone { get; set; }
        public string? landlordPhone2 { get; set; }
        public string? landlordEmail { get; set; }
        public string? landlordEmail2 { get; set; }
        public bool? isPrimaryAndDamagedAddressSame { get; set; }
        public string? businessLegalName { get; set; }
        public bool? businessManagedByAllOwnersOnDayToDayBasis { get; set; }
        public bool? grossRevenues100002000000BeforeDisaster { get; set; }
        public bool? employLessThan50EmployeesAtAnyOneTime { get; set; }
        public bool? farmoperation { get; set; }
        public bool? ownedandoperatedbya { get; set; }
        public bool? farmoperationderivesthatpersonsmajorincom { get; set; }
        public bool? lossesExceed1000 { get; set; }
        public bool? charityProvidesCommunityBenefit { get; set; }
        public bool? charityExistsAtLeast12Months { get; set; }
        public bool? charityRegistered { get; set; }
        public bool? isDamagedAddressVerified { get; set; }
    }

    /// <summary>
    /// Property Damage
    /// </summary>
    public class PropertyDamage
    {
        public bool? floodDamage { get; set; }
        public bool? landslideDamage { get; set; }
        public bool? stormDamage { get; set; }
        public bool? otherDamage { get; set; }
        public string? otherDamageText { get; set; }
        public string? previousApplicationText { get; set; }
        public string? damageFromDate { get; set; }
        public string? damageToDate { get; set; }
        public string? briefDescription { get; set; }
        public bool? wereYouEvacuated { get; set; }
        public string? dateReturned { get; set; }
        public bool? residingInResidence { get; set; }
        public string? previousApplication { get; set; }
    }

    /// <summary>
    /// Clean Up Log
    /// </summary>
    public class CleanUpLog
    {
        public bool? haveInvoicesOrReceiptsForCleanupOrRepairs { get; set; }
    }

    /// <summary>
    /// Supporting Documents
    /// </summary>
    public class SupportingDocuments
    {
        public bool? hasCopyOfARentalAgreementOrLease { get; set; }
    }

    /// <summary>
    /// Damaged Property Address
    /// </summary>
    public class SignAndSubmit
    {
        public SignatureBlock? applicantSignature { get; set; }
        public SignatureBlock? secondaryApplicantSignature { get; set; }
        public string? ninetyDayDeadline { get; set; }
    }
}
