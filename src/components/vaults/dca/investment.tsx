import {
  FormControl,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLoadingContext } from "../../../context/LoadingContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Chart } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import Button from "../../shared/button";
import { useConnection } from "../../../context/connected_context";
import { toast } from "react-toastify";
import { investDCATokens } from "../../../apis/backendAPI";
import { TokenData } from "../../../config/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      width: 250,
    },
  },
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  // elements: { point: { radius: 3 } },
  scales: {
    x: {
      display: false,
    },
    // to remove the y-axis labels
    y: {
      ticks: {
        display: true,
        // beginAtZero: true,
      },
      border: {
        display: true,
      },
      // to remove the y-axis grid
      grid: {
        drawOnChartArea: true,
      },
      type: "linear" as const,
      display: false,
    },
  },
};

interface Props {
  user: any;
  setUser: (value: any) => void;
  setDcaData: (value: any) => void;
  setDcaTransactions: (value: any) => void;
}

const Investment = ({
  user,
  setUser,
  setDcaData,
  setDcaTransactions,
}: Props) => {
  const { setLoading } = useLoadingContext();
  const [mainData, setMainData] = useState<any>({
    PRICE: 0,
    CHANGEPCTDAY: 0,
  });
  const [chartData, setChartData] = useState<any>({
    type: "line",
    labels: [],
    datasets: [
      {
        fill: true,
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        // backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  const [data, setData] = useState<any>({
    token: "BTC",
    amount: "",
    period: "",
    cycle: "",
  });

  const getCallback = useCallback(async () => {
    setLoading(true);

    await axios
      .get(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${data.token}&tsyms=USD`
      )
      .then((response) => {
        const realdata = response.data;
        setMainData(realdata.RAW[data.token].USD);
      });

    await axios
      .get(
        `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${data.token}&tsym=USD&limit=30`
      )
      .then((response) => {
        const realData = response.data.Data.Data;
        setChartData({
          labels: realData.map(
            (point: any, index: number) => `${31 - index}d ago`
          ),
          datasets: [
            {
              fill: false,
              data: realData.map((point: any) => point.close),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 97, 192, 0.2)",
            },
          ],
        });
      });

    setLoading(false);
  }, [data.token]);

  useEffect(() => {
    getCallback();
  }, [getCallback]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prevData: any) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    if (Number(data.period) < Number(data.cycle)) {
      toast.info("Period should be longer than Purchase cycle");
      return;
    }

    if (Number(data.amount) > user.mkBalance) {
      toast.info("Amount should be less than MK Balance");
      return;
    }

    setLoading(true);
    const rdata = await investDCATokens(user.id, data);
    if (rdata.user) {
      setUser(rdata.user);
      setDcaData(rdata.user.dcaVault);
      setDcaTransactions(rdata.dcaVaultTransactions);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    toast.success(`Invested ${data.amount} USD to ${data.token}!`);
  };

  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex gap-5 items-center justify-start w-[190px]">
          <p className="text-[18px] text-white font-bold">To</p>
          <FormControl fullWidth size="small">
            <Select
              name="token"
              value={data.token}
              onChange={handleChange}
              MenuProps={MenuProps}
              sx={{ height: "40px" }}
            >
              {TokenData.map((item: any) => (
                <MenuItem
                  value={item.value}
                  disabled={user.nftAmount == 0 && item.value != "BTC"}
                >
                  <div className="flex gap-3 items-center">
                    <img src={item.icon} alt={item.label} width={25} />
                    <p>{item.label}</p>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-col gap-3 items-center w-full">
          <div className="flex justify-center items-center gap-3">
            <p className="text-white text-[20px] font-medium">
              {Number(mainData?.PRICE).toFixed(3)}{" "}
              <span className="text-[16px]">USD</span>
            </p>
            <p
              className={`text-[16px] font-bold ${
                Number(mainData?.CHANGEPCTDAY) > 0
                  ? "text-[#4ADE80]"
                  : "text-[#f00]"
              }`}
            >
              {`${Number(mainData.CHANGEPCTDAY) > 0 ? "+" : ""}${Number(
                mainData.CHANGEPCTDAY
              ).toFixed(2)} %`}
            </p>
          </div>
          {chartData.datasets[0].data.length > 0 && (
            <Line data={chartData} options={options} />
          )}
        </div>

        <div className="flex flex-col gap-2 items-center">
          <div className="flex self-center rounded-lg px-4 py-2 bg-[#2C323D]">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              onChange={handleChange}
              value={data.amount}
              className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
            />
            <p
              className="text-[14px] text-[#32ADE6] flex items-center"
              onClick={() => {
                setData({
                  ...data,
                  amount: user.mkBalance,
                });
              }}
            >
              MAX
            </p>
          </div>
          <div className="flex flex-col self-center rounded-lg px-4 py-2 bg-[#2C323D]">
            <div className="flex">
              <input
                type="number"
                name="period"
                placeholder="Period"
                onChange={handleChange}
                value={data.period}
                className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
              />
              <p className="text-[14px] text-white flex items-center">Days</p>
            </div>
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              value={Number(data.period)}
              step={1}
              valueLabelDisplay="auto"
              onChange={handleChange}
              name="period"
            />
          </div>
          <div className="flex flex-col self-center rounded-lg px-4 py-2 bg-[#2C323D]">
            <div className="flex">
              <input
                type="number"
                name="cycle"
                placeholder="Purchase cycle"
                onChange={handleChange}
                value={data.cycle}
                id="amount"
                className=" placeholder:text-[14px] font-[400] text-[16px] text-white bg-inherit placeholder:text-[#888888] rounded-lg outline-none px-2 w-[87%] font-btn"
              />
              <p className="text-[14px] text-white flex items-center">Days</p>
            </div>
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              value={Number(data.cycle)}
              step={1}
              valueLabelDisplay="auto"
              onChange={handleChange}
              name="cycle"
              max={Number(data.period)}
            />
          </div>
          <Button
            disabled={!data.amount || !data.period || !data.cycle}
            onClick={handleSubmit}
            text="Invest Now"
            className="!w-[100%] mt-2 !h-[40px]"
          />
        </div>
      </div>
    </>
  );
};

export default Investment;
