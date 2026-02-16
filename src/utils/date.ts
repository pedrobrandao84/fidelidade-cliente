export const formatDate = (value: string) => new Date(value).toLocaleString('pt-BR');
export const isExpired = (value: string) => new Date(value).getTime() < Date.now();
