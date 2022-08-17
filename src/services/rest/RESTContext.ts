import { createContext } from "react";
import REST from "./REST";

export default createContext(new REST(""));
