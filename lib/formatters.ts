export const formatCurrency = (value: string | number | undefined | null) => {
  if (value === undefined || value === null) return "";
  
  if (typeof value === "string") {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(numericValue) / 100);
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

export const formatGameValue = (value: number) => {
  if (!value) return "0";
  if (value >= 1000000) {
    return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace(/\.0$/, "") + "kk";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
  }
  return value.toString();
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
};
