/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-alert, no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createReadStream, writeFile } from "fs";
import csv from "csv-parser";

const inputFile = "scripts/cars.csv";
const outputFile = "data/cars.json";

let jsonData = {};

createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    const make = row.Make;
    const model = row.Model;
    if (!jsonData[make]) {
      jsonData[make] = {};
    }
    if (!jsonData[make][model]) {
      jsonData[make][model] = [];
    }
    if (!jsonData[make][model].find((entry) => entry.Model === model)) {
      const jsonRow = {
        "Vehicle Class": row["Vehicle Class"],
        "Engine Size(L)": parseFloat(row["Engine Size(L)"]),
        Cylinders: parseInt(row.Cylinders),
        Transmission: row.Transmission,
        "Fuel Type": row["Fuel Type"],
        "Fuel Consumption City (L/100 km)": parseFloat(
          row["Fuel Consumption City (L/100 km)"],
        ),
        "Fuel Consumption Hwy (L/100 km)": parseFloat(
          row["Fuel Consumption Hwy (L/100 km)"],
        ),
        "Fuel Consumption Comb (L/100 km)": parseFloat(
          row["Fuel Consumption Comb (L/100 km)"],
        ),
        "Fuel Consumption Comb (mpg)": parseInt(
          row["Fuel Consumption Comb (mpg)"],
        ),
        "CO2 Emissions(g/km)": parseInt(row["CO2 Emissions(g/km)"]),
      };
      jsonData[make][model].push(jsonRow);
    }
  })
  .on("end", () => {
    writeFile(outputFile, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log("Conversion complete. JSON file saved as", outputFile);
      }
    });
  });

/* eslint-enable no-alert, no-console */
