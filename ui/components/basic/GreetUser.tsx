"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";

const GreetUser = () => {
  const [userName, setUserName] = useState("User");
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("firstName");
    if (storedName && typeof storedName === "string") {
      setUserName(storedName);
    }
  }, []);

  return (
    <Box className="flex justify-center items-center gap-2">
      {doneTyping ? (
        <Box
          component="span"
          className="text-white font-semibold"
          sx={{
            opacity: 1,
            transition: "opacity 1s ease-in-out",
          }}
        >
          {`Welcome ${userName}`}
        </Box>
      ) : (
        <Box component="span" className="text-white font-semibold">
          <Typewriter
            key={userName}
            options={{
              autoStart: true,
              loop: false,
            }}
            onInit={(typewriter) => {
              typewriter
                .changeDelay(75)
                .typeString(`Welcome ${userName}`)
                .callFunction(() => setDoneTyping(true))
                .start();
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default GreetUser;
