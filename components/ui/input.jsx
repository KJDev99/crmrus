'use client'
import { useState } from "react";

export default function PhoneInput({ 
  text, 
  w, 
  h, 
  isPhone = false  
}) {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    let val = e.target.value;
    if (isPhone) {
      val = val.replace(/\D/g, "").slice(0, 9);
      let formatted = "";
      if (val.length > 0) formatted += "(" + val.slice(0, 2);
      if (val.length >= 3) formatted += ") " + val.slice(2, 5);
      if (val.length >= 6) formatted += "-" + val.slice(5, 7);
      if (val.length >= 8) formatted += "-" + val.slice(7, 9);
      setValue(formatted);
    } 
    else {
      setValue(val);
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder={text}
        value={value}
        onChange={handleChange}
        className={`px-5 ${w ? w : "w-[480px]"} ${h ? h : "h-[108px]"} 
          text-[37px] text-yellow-400 
          bg-white/10 rounded-3xl outline-none 
          placeholder:text-yellow-400 placeholder:opacity-90`}
        style={{
          backdropFilter: "blur(70px)",
          WebkitBackdropFilter: "blur(70px)",
          boxShadow: "0px 0px 30px -9px #FFFFFF66 inset",
          border: "1px solid transparent",
          borderImage:
            "radial-gradient(120.73% 120.73% at -10.62% 0%, rgba(255, 250, 250, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%), radial-gradient(116.46% 116.46% at 0% 9.52%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.6) 100%)",
          borderImageSlice: 1,
        }}
      />
    </div>
  );
}
