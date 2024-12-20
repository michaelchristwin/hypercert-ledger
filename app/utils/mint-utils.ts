import { AllowlistEntry } from "@hypercerts-org/sdk";

export const TOTAL_UNITS = 100_000_000;

export function prepareAllowlist(application: any, allowPercentage: number) {
  const donations = application.donations;

  // Calculate the units allocated for co-donors based on the allowPercentage
  const othersUnits = Math.floor((allowPercentage / 100) * TOTAL_UNITS);

  // Sum all donations to get the total amount donated in USD
  const totalAmountInUsd = donations.reduce(
    (sum: number, donation: any) => sum + Number(donation.amountInUsd),
    0
  );

  // Initialize totalAllocatedUnits to keep track of assigned units
  let totalAllocatedUnits = 0;
  const allowList: AllowlistEntry[] = donations.map((donation: any) => {
    const donorFraction = Number(donation.amountInUsd) / totalAmountInUsd;
    const donorUnits = Math.floor(donorFraction * othersUnits); // Ensure integer units
    totalAllocatedUnits += donorUnits;

    return {
      address: donation.donorAddress,
      units: BigInt(donorUnits), // Safely convert to BigInt
    };
  });

  // Handle leftover units due to rounding
  let remainingUnits = othersUnits - totalAllocatedUnits;

  // Distribute leftover units to donors if any remain
  for (let i = 0; remainingUnits > 0; i++) {
    allowList[i % donations.length].units += BigInt(1);
    remainingUnits--;
  }

  // Calculate recipient's units as the remaining units
  const recipientUnits = TOTAL_UNITS - othersUnits;

  // Ensure the total matches up correctly
  if (recipientUnits + othersUnits !== TOTAL_UNITS) {
    throw new Error("Total units do not match the expected value!");
  }

  return { allowList, recipientUnits };
}

export function jsonToCsv(jsonArray: AllowlistEntry[], delimiter = ",") {
  // Get CSV headers
  const headers = Object.keys(jsonArray[0]).join(delimiter);

  // Get CSV rows
  const rows = jsonArray.map((row) =>
    Object.values(row)
      .map((value) => (typeof value === "bigint" ? value.toString() : value)) // Handle BigInt
      .join(delimiter)
  );

  // Combine headers and rows
  const csvContent = [headers, ...rows].join("\n");

  return csvContent;
}
