import { motion } from "framer-motion";
import {
  CiShoppingBasket,
  CiViewTable,
  CiUser,
  CiViewList,
  CiMenuBurger,
} from "react-icons/ci";
import { Link } from "react-router-dom";
const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center gap-5 h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
      >
        <CiShoppingBasket className="text-neutral-500" size={150} />
      </motion.div>
      <span className="font-semibold text-xl">
        Chưa có sản phẩm nào trong giỏ hàng.
      </span>
      <span className="text-sm">
        Hãy quay lại và chọn cho mình sản phẩm yêu thích bạn nhé
      </span>
      <Link to="/products" className="underline">
        TIẾP TỤC MUA HÀNG
      </Link>
    </div>
  );
};
export default EmptyCart;
