import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { FaApple } from "react-icons/fa"; // Apple Icon
import { AiFillLock } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import Logo from "../logo.svg";
import app from "../firebaseConfig";
import {
  getDatabase,
  ref,
  set,
  push,
  query,
  orderByChild,
  get,
  remove,
} from "firebase/database";
import { SiOutline } from "react-icons/si";

export default function LoginPage() {
  let [inputName, setInputName] = useState("");
  let [inputEmail, setInputEmail] = useState("");
  let [inputNumber, setInputNumber] = useState("");

  const submitForm = async () => {
    console.log("submit function triggered");
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "contacts/people"));

    if (inputName === "" || inputNumber === "" || inputEmail === "") {
      alert("Please input all details correctly");
    } else {
      set(newDocRef, {
        fullName: inputName,
        emailAddress: inputEmail,
        phoneNumber: inputNumber,
      })
        .then(() => {
          alert("data saved successfully");
          setInputEmail("");
          setInputName("");
          setInputNumber("");
        })
        .catch((error) => {
          alert("error: ", error.message);
        });
    }
  };

  const deleteForm = async () => {
    const db = getDatabase(app);
    if (inputName === "" || inputNumber === "" || inputEmail === "") {
      alert("Please input all details correctly");
    } else {
      try {
        const contactsRef = ref(db, "contacts/people");

        // Fetch all contacts and filter manually
        const snapshot = await get(contactsRef);

        if (snapshot.exists()) {
          let recordKey = null;

          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (
              data.fullName === inputName &&
              data.phoneNumber === inputNumber &&
              data.emailAddress === inputEmail
            ) {
              recordKey = childSnapshot.key;
            }
          });

          if (recordKey) {
            await remove(ref(db, `contacts/people/${recordKey}`));
            alert("Data deleted successfully");

            // Clear input fields
            setInputEmail("");
            setInputName("");
            setInputNumber("");
          } else {
            alert("No matching record found");
          }
        } else {
          alert("No data found in the database");
        }
      } catch (error) {
        alert("Error deleting data: " + error.message);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "50%",
          color: "white",
          background: "#FFFFFF",
          width: "50%",
          borderRadius: 10,
          border: "1px solid grey",
          margin: "10px 30px",
        }}
      >
        <div
          style={{
            background: "grey",
            width: "8%",
            marginLeft: 10,
            borderRadius: 10,
            padding: "1px",
          }}
        >
          <p style={{ color: "white", textAlign: "center" }}>LOGO</p>
        </div>

        <div>
          <h1 style={{ color: "black", textAlign: "center" }}>
            {" "}
            Welcome Back!
          </h1>
        </div>

        <div>
          <p style={{ color: "black", textAlign: "center" }}>
            Log in with face ID
          </p>
        </div>

        <div
          style={{
            flexDirection: "row",
            display: "flex",
            background: "#F7F7F7",
            width: "100%",
            marginLeft: 10,
            borderRadius: 15,
          }}
        >
          <MdEmail style={{}} />
          <input
            style={{}}
            name="name"
            defaultValue="Full Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Full Name"
          />
        </div>

        <div
          style={{
            flexDirection: "row",
            display: "flex",
            background: "#F7F7F7",
            width: "100%",
            marginLeft: 10,
            borderRadius: 15,
          }}
        >
          <AiFillLock />
          <input
            name="emailAddress"
            defaultValue="Email Address"
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            placeholder="Email Address"
          />
        </div>

        <div
          style={{
            flexDirection: "row",
            display: "flex",
            background: "#F7F7F7",
            width: "100%",
            marginLeft: 10,
            borderRadius: 15,
          }}
        >
          <AiFillLock />
          <input
            name="phoneNumber"
            defaultValue="Phone Number"
            inputMode="numeric"
            pattern="[0-9]*"
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <p
          style={{
            justifyContent: "flex-end",
            flex: "display",
            alignContent: "flex-end",
            alignItems: "flex-end",
            alignSelf: "flex-end",
            display: "flex",
          }}
        >
          Forgot Password?
        </p>

        <div
          style={{
            background: "#35C759",
            width: "100%",
            marginLeft: 10,
            borderRadius: 30,
          }}
        >
          {/* <p
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            log in
          </p> */}
          <button onClick={submitForm}> Contact Us</button>
          <button onClick={deleteForm}>Unsubscribe</button>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              background: "#FFFFFF",
              width: "40%",
              borderRadius: 30,
              border: "1px solid grey",
            }}
          >
            <FcGoogle style={{ marginRight: "8px" }} />
          </div>
          <div
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              padding: "10px",
              background: "#FFFFFF",
              width: "40%",
              borderRadius: 30,
              border: "1px solid grey",
            }}
          >
            <FaApple style={{ marginRight: "8px", color: "black" }} />
          </div>
        </div>

        <div></div>
      </div>
      <div
        style={{
          display: "flex",
          width: "50%",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
