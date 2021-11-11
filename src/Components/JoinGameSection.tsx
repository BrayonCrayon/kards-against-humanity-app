import React from "react";

const JoinGameSection: React.FC = () => {
  return (
    <div data-testid="join-game-section">
      <form
        data-testid="join-game-form"
        onSubmit={submitToApi}
        className="flex w-1/3 flex-col p-4 shadow-lg rounded border"
      >
        <label className="mb-4 pl-2 mt-4">
          Name:
          <input
            type="text"
            data-testid="join-game-name-input"
            name="name"
            className="border-2 rounded shadow ml-2 px-2"
          />
        </label>
        <label className="mb-4 pl-2 mt-4">
          Code:
          <input
            type="text"
            data-testid="join-game-code-input"
            name="code"
            className="border-2 rounded shadow ml-2 px-2"
          />
        </label>

        <button
          data-testid="join-game-form-submit"
          className="bg-gray-300 p-2 text-gray-900 font-semibold rounded shadow mt-4 hover:bg-gray-200 "
        >
          Enter game
        </button>
      </form>
    </div>
  );
};

export default JoinGameSection;
