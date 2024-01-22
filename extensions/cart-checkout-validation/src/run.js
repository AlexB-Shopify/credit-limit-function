// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
    // Parse the decimal (serialized as a string) into a float.
    let orderTotal = parseFloat(input.cart.cost.totalAmount.amount);
    let creditLimitRemaining = 10000.0;
    // purchasing company stuffs
    let isB2B = false;
  
    //check if buyer ident is present
    if (input.cart.buyerIdentity) {
      let buyerIdentity = input.cart.buyerIdentity;
      //set isB2B if company present
      if (buyerIdentity.purchasingCompany) {
        isB2B = true;
        let purchasingCompany = buyerIdentity.purchasingCompany;
        if (purchasingCompany.company.metafield) {
          let metafield = purchasingCompany.company.metafield;
          creditLimitRemaining = parseFloat(metafield.value);
        }
      }
    }
  
    let errors = [];
    let message = `This cart exceeds your company's remaining credit limit of $${creditLimitRemaining}. Please pay your outstanding balance before proceeding with this order.`;
    let error = {
      localizedMessage: message,
      target: "cart",
    };
  
    if (!isB2B) {
      return { errors };
    }
  
    // render error and block checkout if cart exceeds company's remaining credit
    if (orderTotal > creditLimitRemaining) {
      errors.push(error);
    }
  
    return { errors };
  };