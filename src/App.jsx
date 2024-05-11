import React, { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./Print.css";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const [rowCount, setRowCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalweight, setTotalWeight] = useState(0);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [viewtable, setViewTable] = useState(false);
  const [itemlist, setItemList] = useState([]);
  const [invoiceno, setInvoiceNo] = useState("GP1");
  const [itemdata, setItemData] = useState({
    item: "",
    price: 0,
    category: "Select category",
    weight: "",
  });
  const fetchData = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/gjwqv8qvch90x");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setRowCount(data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });
  const handleItemChange = (e) => {
    setItemData({ ...itemdata, [e.target.name]: e.target.value });
  };
  const addItem = () => {
    setTotalPrice(Number(totalPrice) + Number(itemdata.price));
    setTotalWeight(Number(totalweight) + Number(itemdata.weight));
    let newItemList = itemlist;
    newItemList.push(itemdata);
    setItemList(newItemList);
    console.log(itemlist);
    toast.success("Item Added");
    setItemData({
      item: "",
      price: "",
      category: "",
      weight: "",
    });
    console.log(itemdata);
  };
  const printInvoice = () => {
    if (name == "" || mobile == "" || address == "" || itemlist.length == 0) {
      toast.error("Please fill details properly");
    } else {
      window.print();
      toast.success("Invoice Printed");
      setName("");
      setMobile("");
      setAddress("");
      setItemData({
        item: "",
        price: "",
        category: "",
        weight: "",
      });
      setItemList([]);
      setViewTable(false);
    }
  };
  const saveInfo = async (e) => {
    if (name == "" || mobile == "" || address == "" || itemlist.length == 0) {
      toast.error("Please fill details properly");
    } else {
      e.preventDefault();
      let itemNameList = [];
      itemlist.forEach((element) => {
        itemNameList.push(element.item);
      });
      let itemListString = itemNameList.join(", ");
      fetch("https://sheetdb.io/api/v1/gjwqv8qvch90x", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              Invoice_No: "GS" + (rowCount + 1),
              Name: name,
              Items: itemListString,
              Total_Weight: totalweight,
              Total_Net: (totalPrice / 1.03).toFixed(2),
              Tax: ((totalPrice * 3) / 103).toFixed(2),
              Total_Incl_Tax: totalPrice.toFixed(2),
            },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      toast.success("Saved in records");
    }
  };
  const handleDelete = (index) => {
    setTotalPrice(Number(totalPrice) - Number(itemlist[index].price));
    setTotalWeight(Number(totalweight) - Number(itemlist[index].weight));
    const updatedItemList = [
      ...itemlist.slice(0, index),
      ...itemlist.slice(index + 1),
    ];
    setItemList(updatedItemList);
    toast.error("Item Deleted");
  };
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            RatnaSarita Jewellers
          </h1>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            GSTIN: 27AAMFR8954J1ZD
          </h2>
          <form action="#">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name of Purchaser
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Name of Purchaser"
                  required=""
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full">
                <label
                  for="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Invoice No.
                </label>
                <span class="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                  GS{rowCount + 1}
                </span>
              </div>
              <div className="w-full">
                <label
                  for="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 19 18"
                    >
                      <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="mobile"
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-456-7890"
                    required
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  for="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  rows="2"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
              {!viewtable && (
                <>
                  <div className="w-full">
                    <label
                      for="item"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item
                    </label>
                    <input
                      type="text"
                      name="item"
                      id="item"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Item"
                      required=""
                      onChange={handleItemChange}
                      value={itemdata.item}
                    />
                  </div>
                  <div className="w-full">
                    <label
                      for="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      onChange={handleItemChange}
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="₹"
                      required=""
                      onChange={handleItemChange}
                      value={itemdata.price}
                    />
                  </div>
                  <div>
                    <label
                      for="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={handleItemChange}
                      value={itemdata.category}
                    >
                      <option selected="">Select category</option>
                      <option value="KDM">KDM</option>
                      <option value="916 HM">916 HM</option>
                      <option value="750 HM">750 HM</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="item-weight"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Item Weight (gms)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Weight in grams"
                      required=""
                      onChange={handleItemChange}
                      value={itemdata.weight}
                    />
                  </div>
                </>
              )}
              <ToastContainer />
            </div>

            {!viewtable && (
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-blue-300 border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={addItem}
                >
                  Add product
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-black border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => setViewTable(true)}
                >
                  Review
                </button>
              </div>
            )}
          </form>

          {viewtable && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg top-5 mb-8">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Weight
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 no-print">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itemlist.map((item, index) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{item.item}</td>
                      <td className="px-6 py-4">{item.weight}</td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4">
                        ₹ {(item.price / 1.03).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 no-print">
                        <button
                          className="hover:bg-gray-100"
                          onClick={() => handleDelete(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M6 6L6 21 18 21 18 6z" />
                            <path d="M10 6L10 3 14 3 14 6z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">Total</td>
                    <td className="px-6 py-4">{totalweight}</td>
                    <td className="px-6 py-4">{}</td>
                    <td className="px-6 py-4">
                      ₹ {(totalPrice / 1.03).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{}</td>
                  </tr>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">Tax</td>
                    <td className="px-6 py-4">CGST @ 1.5%</td>
                    <td className="px-6 py-4">SGST @ 1.5%</td>
                    <td className="px-6 py-4">
                      ₹ {((totalPrice * 3) / 103).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{}</td>
                  </tr>
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">Total Incl. Taxes</td>
                    <td className="px-6 py-4">{}</td>
                    <td className="px-6 py-4">{}</td>
                    <td className="px-6 py-4">₹ {totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">{}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {viewtable && (
            <div className="flex justify-between">
              <button
                type="button"
                className="no-print text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => setViewTable(false)}
              >
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-0 w-3.5 h-3.5 mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 5H1M5.5 9L1 5m0 0l4.5-4M1 5l4.5 4"
                    />
                  </svg>
                  Back
                </div>
              </button>

              <button
                type="submit"
                className="no-print text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={saveInfo}
              >
                Save
              </button>

              <button
                type="button"
                className="no-print text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={printInvoice}
              >
                <div className="flex items-center">
                  Print
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default App;
