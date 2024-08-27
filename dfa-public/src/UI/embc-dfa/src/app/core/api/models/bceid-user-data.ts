/* tslint:disable */
/* eslint-disable */

/**
 * Use reflection to populate this class with values from JWT access_token.
 * Property names should be exactly the same as the corresponding Principal Claim -
 * except in the case where a [Description] attribute is used.
 */
export interface BceidUserData {
  bceid_business_guid?: string;
  bceid_business_name?: string;
  bceid_user_guid?: string;
  bceid_username?: string;
  display_name?: string;
  email_verified?: boolean;

  /**
   * emailaddress: use special logic to get ClaimTypes.Email
   */
  emailaddress?: string;
  family_name?: string;
  given_name?: string;
  name?: string;
  preferred_username?: string;
  sid?: string;
}
