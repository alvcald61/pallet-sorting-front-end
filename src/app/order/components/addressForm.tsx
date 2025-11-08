"use client";
import React, { useEffect, useState } from "react";
import { Card, TextInput, Text, Badge, Button, Group } from "@mantine/core";
import { DatePickerInput, TimeGrid } from "@mantine/dates";
import { getAvailableSlots } from "@/lib/api/order/orderApi";
import { AsyncAutocomplete } from "./asyncAutoComplete";
import useOrderStore from "@/lib/store/OrderStore";

export const AddressForm = () => {
  const { addAddress, address } = useOrderStore();
  const [from, setFrom] = useState(address?.fromAddress || "");
  const [to, setTo] = useState(address?.toAddress || "");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [hours, setHours] = useState<string[] | null>(null);
  const [placesSuggestions, setPlacesSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setPlacesSuggestions([]);
  }, [from, to]);

  const displaySuggestions = function (predictions, status) {
    //@ts-ignore
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    const suggestions = predictions.map((prediction) => prediction.description);
    setPlacesSuggestions(suggestions);
  };

  const fetchFunction = async (
    searchQuery: string,
    signal: AbortSignal
  ): Promise<boolean> => {
    try {
      // const client = new Client({});
      // const response = await client.placeAutocomplete({
      //   params: {
      //     input: searchQuery,
      //     key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      //     components: ["country:pe"],
      //   },
      //   signal: signal,
      // });
      // const suggestions = response.data.predictions.map(
      //   (prediction) => prediction.description
      // );
      // setPlacesSuggestions(suggestions);
      // @ts-ignore

      const service = new google.maps.places.AutocompleteService();

      service.getQueryPredictions(
        { input: searchQuery, signal, components: "country:pe" },
        displaySuggestions
      );
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchSlots = async () => {
      if (date) {
        console.log("Selected date:", date);
        const slots = await getAvailableSlots(date);
        setHours(slots);
      }
    };
    fetchSlots();
  }, [date]);

  const registerDate = (value: string | null) => {
    const address = {
      fromAddress: from,
      toAddress: to,
      date: date,
      time: value,
    };
    setTime(value);
    addAddress(address);
    console.log("Registered address:", address);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Text>Solicitud transporte de bultos</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="md">
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                {/* <TextInput
                  label="Desde"
                  placeholder="Calle ..., Los Olivos"
                  value={from}
                  onChange={(event) => setFrom(event.currentTarget.value)}
                /> */}
                <AsyncAutocomplete
                  fetchFunction={fetchFunction}
                  data={placesSuggestions}
                  value={from}
                  setValue={setFrom}
                />
              </div>
              <div className="grid gap-2">
                {/* <TextInput
                  label="Hacia"
                  placeholder="Calle ..., Los Olivos"
                  value={to}
                  onChange={(event) => setTo(event.currentTarget.value)}
                /> */}
                <AsyncAutocomplete
                  fetchFunction={fetchFunction}
                  data={placesSuggestions}
                  value={to}
                  setValue={setTo}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <DatePickerInput
                label="Pick date"
                placeholder="Pick date"
                value={date}
                onChange={setDate}
              />
              {hours == null ? null : hours.length === 0 ? (
                <Text c={"red"}>No hay horas disponibles para esta fecha</Text>
              ) : (
                <TimeGrid
                  simpleGridProps={{
                    type: "container",
                    cols: { base: 1, "180px": 2, "320px": 3 },
                    spacing: "xs",
                  }}
                  value={time}
                  onChange={registerDate}
                  data={hours}
                />
              )}
            </div>
          </form>
        </Card.Section>
      </Card>
    </>
  );
};
