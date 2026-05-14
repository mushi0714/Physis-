exports.canAddPlan = (user) => {
  const MAX_PLANS = 3;
  if (user.active_plan_ids.length >= MAX_PLANS) {
    return {
      canAdd: false,
      message: "You've reached the maximum of 3 active plans. Balance is key to Homeostasis."
    };
  }
  return { canAdd: true };
};