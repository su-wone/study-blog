"use client";

import { useEffect } from "react";

export default function CodeCopyButton() {
  useEffect(() => {
    const pres = document.querySelectorAll(".prose pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.textContent = "복사";
      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (code) {
          await navigator.clipboard.writeText(code.textContent || "");
          btn.textContent = "복사됨!";
          setTimeout(() => { btn.textContent = "복사"; }, 2000);
        }
      });
      pre.appendChild(btn);
    });
  }, []);

  return null;
}
