import { route, getAuthHeader } from "../_lib/vercel.js";
import { requireStudent } from "../_lib/auth.js";

export default route(["GET"], async (req, res) => {
  const { user, prospect, subscription } = await requireStudent(getAuthHeader(req));
  res.status(200).json({
    email: prospect.email ?? user.email,
    name: prospect.name,
    subscription_status: subscription.status,
    subscription_product_id: subscription.product_id,
  });
});
