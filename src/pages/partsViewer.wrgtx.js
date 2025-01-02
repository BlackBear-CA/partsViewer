import wixData from 'wix-data';
import { saveAs } from 'file-saver';
import { utils, writeFile } from 'xlsx';

$w.onReady(function () {
    // Function to perform the search
    function performSearch() {
        const searchValue = $w("#input1").value.trim(); // Get the input value
        const selectedCategory = $w("#dropdown1").value; // Get the selected dropdown value

        console.log("Search initiated with value:", searchValue);
        console.log("Selected search category:", selectedCategory);

        if (searchValue) {
            let filter;

            // Determine the filter based on the selected category
            switch (selectedCategory) {
                case "Search Item by SKUs": // Matches SKUs dropdown choice
                    filter = wixData.filter().contains("skUs", searchValue);
                    break;
                case "Search Item by Material Description": // Matches Material Description dropdown choice
                    filter = wixData.filter().contains("itemDetailedDescription", searchValue);
                    break;
                case "Search by Manufacturer Part Nos.": // Matches Manufacturer Part Nos dropdown choice
                    filter = wixData.filter().contains("mfgPartNos", searchValue);
                    break;
                default:
                    console.error("Unknown category selected:", selectedCategory);
                    return;
            }

            // Apply the filter
            $w("#dataset2")
                .setFilter(filter)
                .then(() => {
                    console.log("Search filter applied successfully.");
                })
                .catch((err) => {
                    console.error("Error applying search filter:", err);
                });
        } else {
            // Clear the filter if the input is empty
            $w("#dataset2")
                .setFilter(wixData.filter())
                .then(() => {
                    console.log("Filter cleared; showing all items.");
                })
                .catch((err) => {
                    console.error("Error clearing filter:", err);
                });
        }
    }

    // Set up the click event for the search button
    $w("#button5").onClick(() => {
        performSearch();
    });

    // Set up the key press event for the input field
    $w("#input1").onKeyPress((event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // Function to export dataset data to Excel
    async function exportToExcel() {
        const data = await $w("#dataset2").getItems(); // Get items from the dataset

        if (data.items.length === 0) {
            console.log("No data available to export.");
            return;
        }

        // Prepare the data for Excel
        const rows = data.items.map((item) => ({
            SKU: item.skUs,
            MaterialDescription: item.materialDescription,
            ItemDetailedDescription: item.itemDetailedDescription,
            Manufacturer: item.manufacturer,
            BOMQty: item.bomQty,
            BOMStructure: item.bomStructure,
            Reference: item.reference,
        }));

        // Generate Excel workbook and sheet
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(rows);
        utils.book_append_sheet(workbook, worksheet, "PartsViewerData");

        // Generate Excel file
        const excelBuffer = writeFile(workbook, "PartsViewerData.xlsx", {
            bookType: "xlsx",
            type: "buffer",
        });

        // Use FileSaver.js to trigger download
        saveAs(
            new Blob([excelBuffer], { type: "application/octet-stream" }),
            "PartsViewerData.xlsx"
        );

        console.log("Excel file generated successfully.");
    }

    // Set up the click event for the download button
    $w("#button6").onClick(() => {
        exportToExcel();
    });
});
