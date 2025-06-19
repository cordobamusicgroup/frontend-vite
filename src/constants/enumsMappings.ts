// Mapping for 'type'
export const typeMap = {
  PERSON: "Individual",
  BUSINESS: "Empresa",
  // Otros valores de 'type' según tus necesidades
};

// Mapping for 'taxIdType'
export const taxIdTypeMap = {
  DNI: "DNI",
  CUIT: "CUIT",
  PASSPORT: "Pasaporte",
  // Otros valores de 'taxIdType' según tus necesidades
};

export type TypeMap = typeof typeMap;
export type TaxIdTypeMap = typeof taxIdTypeMap;

