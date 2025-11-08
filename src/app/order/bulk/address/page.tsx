"use client";
import React, { useState } from "react";

import { Tabs } from "@mantine/core";

import { AddressForm } from "../../components/addressForm";
import useOrderStore from "@/lib/store/OrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { Radio, Group } from "@mantine/core";
import { Text } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Stepper } from "@mantine/core";
const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  
  
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <div className="">
        <AddressForm />
      </div>
    </div>
  );
};

export default Page;
