"use client";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cityData } from "@/data/cityData";

export default function UploadPage() {

  const uploadCities = async () => {
    try {

      for (const cityKey in cityData) {

        await setDoc(
          doc(db, "cities", cityKey),
          cityData[cityKey]
        );

        console.log(`${cityKey} uploaded`);
      }

      alert("All cities uploaded successfully");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="pt-30">
      <button
        onClick={uploadCities}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Upload All Cities
      </button>
    </div>
  );
}



// homepage


// "use client";

// import { doc, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { homeData } from "@/data/homeData";

// export default function UploadHomePage() {

//   const uploadHomeData = async () => {
//     try {

//       await setDoc(
//         doc(db, "home", "homepage"),
//         homeData
//       );

//       alert("Home data uploaded successfully");

//     } catch (error) {
//       console.error(error);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div className="pt-30">
//       <button
//         onClick={uploadHomeData}
//         className="bg-blue-600 text-white px-6 py-3 rounded"
//       >
//         Upload Home Data
//       </button>
//     </div>
//   );
// }