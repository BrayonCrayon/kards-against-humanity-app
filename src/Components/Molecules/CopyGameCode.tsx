import React, { FC } from "react";
import CopyIcon from "@/Components/Icons/CopyIcon";
import ClipBoard from "@/Components/Atoms/ClipBoard";

interface CopyGameCodeProps {
    code: string;
}

const CopyGameCode: FC<CopyGameCodeProps> = ({ code }) => {

    return (
        <ClipBoard copy={code} successMessage="Game code copied!" messagePosition="center">
            <span className="inline-block align-middle">
              <CopyIcon />
            </span>
            <span className="text-gray-700 px-1 inline-block align-middle">Code: {code}</span>
        </ClipBoard>
    );
}

export default CopyGameCode;