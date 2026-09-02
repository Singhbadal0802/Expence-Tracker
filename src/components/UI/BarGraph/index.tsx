import React from "react";

const BarGraph = (data: any) => {
  const mock = [{ rowValue: 30 }, { rowValue: 20 }, { rowValue: 10 }];

  const mock2 = [{ colValue: 10 }, { colValue: 20 }, { colValue: 30 }];

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="grid grid-cols-1">
          {mock.map((element: any) => (
            <div
              key={`row-${element.rowValue}`}
              className="flex jutify-center items-start h-16 w-8"
            >
              {element.rowValue}
            </div>
          ))}
        </div>
        <div
          className={`grid grid-rows-${mock.length} bg-gray-200 w-full h-full`}
        >
          {mock.map((element: any) => (
            <div
              key={element.rowValue}
              className={`grid grid-cols-${mock.length} bg-gray-200 w-full`}
            >
              {mock.map((element: any) => {
                return (
                  <div
                    key={element.rowValue}
                    className="flex w-full border-b-2 border-gray-300 jutify-center items-center"
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex justify-center w-8">0</div>
        <div className="flex flex-1">
          <div className={`grid grid-cols-${mock2.length} w-full`}>
            {mock2.map((element: any) => (
              <div
                key={element.value}
                className="flex w-full items-center justify-end"
              >
                {element.colValue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
