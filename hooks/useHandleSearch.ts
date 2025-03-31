import { useEffect, useState } from "react";

export const useHandleSearch = <T>(
  data: T[],
  valuesToCheck: (keyof T)[],
  value?: string
): { filteredData: T[] } => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const filterBySearch = <T>(
    values: T[],
    attributes: (keyof T)[],
    search: string
  ): T[] => {
    return values.filter((value) => {
      const searchLowercase = search.toLowerCase();
      return !!attributes.find((attribute) =>
        `${value[attribute]}`.toLowerCase().includes(searchLowercase)
      );
    });
  };
  useEffect(() => {
    const filteredData = value
      ? filterBySearch(data, valuesToCheck, value)
      : data;

    setFilteredData(filteredData);
  }, [value, data]);

  return { filteredData: filteredData };
};
