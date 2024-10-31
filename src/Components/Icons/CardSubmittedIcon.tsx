import {FC} from "react";

interface CardSubmittedIconProps {
    className?: string;
    dataTestId?: string;
}

const CardSubmittedIcon: FC<CardSubmittedIconProps> = ({ className = "", dataTestId = "card-submitted-icon" }) => {
    return <svg data-testid={dataTestId} className={className} width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.8683 19.1358H3.95282C3.32836 19.1358 2.82031 18.6277 2.82031 18.0033V1.1325C2.82031 0.508046 3.32836 0 3.95282 0H16.8683C17.4927 0 18.0008 0.508046 18.0008 1.1325V18.0029C18.0008 18.6273 17.4927 19.1354 16.8683 19.1354V19.1358ZM3.95282 0.963668C3.85953 0.963668 3.78398 1.03961 3.78398 1.1325V18.0029C3.78398 18.0961 3.85992 18.1717 3.95282 18.1717H16.8683C16.9616 18.1717 17.0371 18.0958 17.0371 18.0029V1.1325C17.0371 1.03922 16.9612 0.963668 16.8683 0.963668H3.95282Z" fill="#1A1A1A"/>
        <path d="M6.80309 21.0007C10.2551 21.0007 13.0534 18.2023 13.0534 14.7504C13.0534 11.2984 10.2551 8.5 6.80309 8.5C3.35111 8.5 0.552734 11.2984 0.552734 14.7504C0.552734 18.2023 3.35111 21.0007 6.80309 21.0007Z" fill="#1A1A1A"/>
        <path d="M4.34961 15.0757L6.28582 17.0119L9.25467 12.4941" stroke="white" strokeLinecap="round"/>
    </svg>
}

export default CardSubmittedIcon;