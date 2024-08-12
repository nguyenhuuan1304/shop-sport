import { Alert } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { getProvincesWithDetail } from "vietnam-provinces";
import Select from "react-select";
import { Input } from "antd";
import { register } from "../redux/slices/authSlice";

export default function RegisterPage() {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const errorMessages = useSelector((state) => state.auth.errorMessages);
  const success = useSelector((state) => state.auth.createdAccountSuccess);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [dataProvinces, setDataProvinces] = useState({});

  const [valueProvince, setValueProvicce] = useState(null);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [valueWard, setValueWard] = useState(null);

  const [address, setAddress] = useState("");
  const [optionsProvices, setOptionsProvices] = useState([]);
  const [optionsDistricts, setOptionsDistricts] = useState([]);
  const [optionsWards, setOptionsWards] = useState([]);

  const [error, setError] = useState("");

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    number_phone: "",
    address: "",
    dob: "",
    username: "",
  });

  const setValueAddress = () => {
    setPayload((prevState) => ({
      ...prevState,
      address:
        address +
        " ," +
        valueWard?.label +
        ", " +
        valueDistrict?.label +
        ", " +
        valueProvince?.label,
    }));
  };

  useEffect(() => {
    if (success == true) {
      navigate("/login");
    }
  }, [success]);

  useEffect(() => {
    setPayload((prevState) => ({
      ...prevState,
      address:
        address +
        " ," +
        valueWard?.label +
        ", " +
        valueDistrict?.label +
        ", " +
        valueProvince?.label,
    }));
  }, [address, valueWard, valueDistrict, valueProvince]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("form ", payload);
    // Tạo một bản sao của payload mà không có trường confirmPassword
    const { confirmPassword, ...payloadWithoutConfirmPassword } = {
      ...payload,
    };

    dispatch(register(payloadWithoutConfirmPassword));
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await getProvincesWithDetail();
        setDataProvinces(response);

        const provincesArray = Object.values(response);
        const formattedOptions = provincesArray.map((province) => ({
          value: province.code,
          label: province.name,
        }));

        setOptionsProvices(formattedOptions);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (valueProvince) {
      const selectedProvince = dataProvinces[valueProvince.value];
      const districtsArray = selectedProvince?.districts
        ? Object.values(selectedProvince.districts)
        : [];

      const formattedDistricts = districtsArray.map((district) => ({
        value: district.code,
        label: district.name,
      }));

      setOptionsDistricts(formattedDistricts);
      setOptionsWards([]);
    }
  }, [valueProvince, dataProvinces]);

  useEffect(() => {
    if (valueDistrict) {
      const selectedProvince = dataProvinces[valueProvince.value];
      const selectedDistrict = selectedProvince?.districts[valueDistrict.value];
      const wardsArray = selectedDistrict?.wards
        ? Object.values(selectedDistrict.wards)
        : [];

      const formattedWards = wardsArray.map((ward) => ({
        value: ward.code,
        label: ward.name,
      }));

      setOptionsWards(formattedWards);
    }
    setValueAddress();
  }, [valueDistrict, dataProvinces, valueProvince]);

  useEffect(() => {
    if (
      payload.confirmPassword != payload.password &&
      payload.confirmPassword
    ) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
    } else {
      setError("");
    }
  }, [payload.confirmPassword, payload.password]);

  useEffect(() => {
    setPayload((prevState) => ({
      ...prevState,
      username: payload.first_name + " " + payload.last_name,
    }));
  }, [payload.first_name, payload.last_name]);

  const changeHandlerProvice = (selectedOption) => {
    setValueProvicce(selectedOption);
    setValueDistrict(null);
    setValueWard(null);
    setValueAddress();
  };

  const changeHandlerDistric = (selectedOption) => {
    setValueDistrict(selectedOption);
    setValueWard(null);
  };

  const changeHandlerWard = (selectedOption) => {
    setValueWard(selectedOption);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex min-h-full bg-white shadow-lg rounded-md flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-full max-w-4xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl flex flex-col items-center">
          <Link to="/" className="hover:opacity-50">
            <img src={logo} alt="" className="h-28" />
          </Link>
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Đăng ký
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Tên đăng nhập
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    placeholder="Nhập tên đăng nhập"
                    value={payload.email}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                      }));
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                  {errorMessages && <p style={{ color: "red" }}>{errorMessages?.message}</p>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Mật khẩu
                </label>
                <div className="mt-2">
                  <Input.Password
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Nhập mật khẩu"
                    value={payload.password}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }));
                    }}
                    className="h-12 rounded-md text-gray-900 placeholder:text-gray-400 text-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Nhập lại mật khẩu
                </label>
                <div className="mt-2">
                  <Input.Password
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Xác nhận mật khẩu"
                    value={payload.confirmPassword}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        confirmPassword: e.target.value,
                      }));
                    }}
                    className="h-12 rounded-md text-gray-900 placeholder:text-gray-400 text-lg"
                  />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Họ
                </label>
                <div className="mt-2">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Nhập họ của bạn"
                    value={payload.last_name}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        last_name: e.target.value,
                      }));
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="first_name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Tên
                </label>
                <div className="mt-2">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Nhập tên của bạn"
                    value={payload.first_name}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        first_name: e.target.value,
                      }));
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dob"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Ngày sinh
                </label>
                <div className="mt-2">
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    autoComplete="given-name"
                    required
                    placeholder="Nhập ngày sinh của bạn"
                    value={payload.dob}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        dob: e.target.value,
                      }));
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="number_phone"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Số điện thoại
                </label>
                <div className="mt-2">
                  <input
                    id="number_phone"
                    name="number_phone"
                    type="text"
                    autoComplete="tel"
                    required
                    placeholder="Nhập số điện thoại"
                    value={payload.number_phone}
                    onChange={(e) => {
                      setPayload((prevState) => ({
                        ...prevState,
                        number_phone: e.target.value,
                      }));
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="address"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Địa chỉ
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    required
                    placeholder="Nhập địa chỉ của bạn"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    className="block w-full h-12 pl-4 focus:outline-none rounded-md border-2 border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Tỉnh / Thành phố
                </label>
                <div className="mt-2">
                  <Select
                    options={optionsProvices}
                    value={valueProvince}
                    onChange={changeHandlerProvice}
                    placeholder={"chọn tỉnh"}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Quận / Huyện
                </label>
                <div className="mt-2">
                  <Select
                    options={optionsDistricts}
                    value={valueDistrict}
                    onChange={changeHandlerDistric}
                    isDisabled={!valueProvince}
                    placeholder={"chọn quận huyện"}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="ward"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Phường / Xã
                </label>
                <div className="mt-2">
                  <Select
                    options={optionsWards}
                    value={valueWard}
                    onChange={changeHandlerWard}
                    isDisabled={!valueDistrict}
                    placeholder={"chọn phường xã"}
                  />
                </div>
              </div>
            </div>

            {errorMessages?.length > 0 && (
              <Alert
                message={
                  <ul>
                    {errorMessages?.map((err, index) => (
                      <li key={index}>{err.message}</li>
                    ))}
                  </ul>
                }
                type="error"
              />
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 py-2 px-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Đăng ký
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-lg text-gray-500">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
