import { AccountV1 } from "./V1";
import { AccountVariant } from "./types";

export const AccountVariants = {
  [AccountVariant.V1]: AccountV1,
  default: AccountV1,
};
