import { ActionIcon } from "@mantine/core";
import React from "react";
import { FaRegTrashCan } from "react-icons/fa6";

type PackageItemType = {
  is3D?: boolean;
  name?: string;
  id: string;
  width: number;
  length: number;
  height?: number;
  weight: number;
  quantity?: number;
  onDelete: (id: string) => void;
};

export const PackageItem = ({
  is3D,
  id,
  name,
  width,
  height,
  weight,
  length,
  quantity,
  onDelete,
}: PackageItemType) => {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
      <div className="flex flex-col">
        <p className="text-base font-medium">{`${name} ${id} (x${quantity})`}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {is3D
            ? `${width}m x ${length}m x ${height}m, ${weight}Kg`
            : `${width}m x ${length}m, ${weight}Kg`}
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
      {/* <button className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 m-2">
                      <FaRegTrashCan
                        color="red"
                        className="text-gray-500  hover:text-red-500"
                      />
                    </button> */}
    </div>
  );
};
