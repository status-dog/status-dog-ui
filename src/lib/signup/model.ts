import type {
  PublicKeyCredentialUserEntityJSON,
  RegistrationCredentialJSON,
} from "@simplewebauthn/typescript-types";

export interface RegistrationVerificationBody {
  user: PublicKeyCredentialUserEntityJSON;
  attResponse: RegistrationCredentialJSON;
}

export interface CreationOptionsParams {
  email: string;
}
export interface AuthenticationOptionsParams {
  email: string;
}
