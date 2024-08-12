import {
  getOrderAddressByUserId,
  addOrderAddress,
  deleteOrderAddress,
  updateOrderAddress,
  setDefaultOrderAddress,
} from "./orderAddress.service.js";

async function getOrderAddressByUserIdController(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_addresses = await getOrderAddressByUserId(user_id);
    return res.status(200).json(order_addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function addOrderAddressController(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_address = req.body.order_address;
    const result = await addOrderAddress(user_id, order_address);
    if (result) return res.status(200).json(result);
    else return res.status(404).json({ message: "add unsuccessfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function deleteOrderAddressController(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_address_id = req.params.id;
    const result = await deleteOrderAddress(user_id, order_address_id);
    if (result) {
      return res.status(200).json({ message: "delete successfull!" });
    } else
      return res.status(404).json({ message: "not found order address id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function updateOrderAddressController(req, res) {
  try {
    const order_address_id = req.params.id;
    const order_address = req.body.order_address;
    const result = await updateOrderAddress(order_address_id, order_address);
    if (result) return res.status(200).json(order_address);
    else
      return res.status(404).json({ message: "not found order address id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function setDefaultOrderAddressController(req, res) {
  try {
    const user_id = req.user.user_id;
    const order_address_id = req.params.id;
    const result = await setDefaultOrderAddress(user_id, order_address_id);
    if (!result)
      return res.status(404).json({ message: "not found order address id!" });
    else
      return res.status(200).json({
        message: `set default is success with order address id ${order_address_id}`,
        data: result,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export {
  getOrderAddressByUserIdController,
  addOrderAddressController,
  deleteOrderAddressController,
  updateOrderAddressController,
  setDefaultOrderAddressController,
};
