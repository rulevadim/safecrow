export type ClaimCreate = {
  order_id: string; // `validate:"required"`
  description: string; // `validate:"required"`
  files: string[];
};

export type ClaimCreateResponse = {
  claim_id: string;
};
