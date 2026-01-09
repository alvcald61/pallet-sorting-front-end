import { ActionIcon } from "@mantine/core";
import React from "react";
import { FaRegTrashCan } from "react-icons/fa6";

type PackageItemType = {
  name?: string;
  id: string;
  weight: number;
  volume: number;
  quantity?: number;
  onDelete: (id: string) => void;
};

export const BulkItem = ({
  id,
  name,
  volume,
  weight,
  quantity,
  onDelete,
}: PackageItemType) => {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
      <div className="flex flex-col">
        <p className="text-base font-medium">{`${name} ${id} (x${quantity})`}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {`${volume}m3 - ${weight}Kg `}
        </p>
      </div>
      <ActionIcon
        variant="subtle"
        aria-label="Settings"
        color="red"
        onClick={() => onDelete(id)}
      >
        <FaRegTrashCan style={{ width: "70%", height: "70%" }} stroke={"1.5"} />
      </ActionIcon>
    </div>
  );
};
