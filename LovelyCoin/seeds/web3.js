web3 = new Web3(window.web3.currentProvider);

let oContractObject;
var contract;
// Accounts
let account;
const BINANCE_CHAINID = `0x${Number(1337).toString(16)}`;

hide();

async function metamaskCheck() {
  try {
    if (window.ethereum != "undefined") {
      oWeb3 = new Web3(window.ethereum);
      console.log("Metamask is installed");
      const reqAccount = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(`Connected to ${reqAccount} account`);
      return reqAccount;
    }
  } catch (error) {
    console.log(error);
  }
}

$("#btn-connect").on("click", async () => {
  try {
    metamaskCheck();

    let reqChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log(`Metamask is connected to ${reqChainId} chain ID`);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BINANCE_CHAINID }],
      });
      reqAccount = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      account = reqAccount[0];
      console.log("Account address: ", account.toString());

      finalChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      console.log(`Connected metamask account: ${finalChainId}`);
    } catch (error) {
      console.log(error);
    }

    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    oContractObject = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("Contract Object: ", oContractObject);
  } catch (error) {
    console.log(error);
  }
});

$("#btn-mint").on("click", async () => {
  let nAmount = $("#amt").val();
  console.log("amount", nAmount);
  console.log(typeof nAmount);
  waiting();
  if (nAmount <= 0 || !nAmount || isNaN(nAmount)) {
    alert("Invalid Input");
    return;
  }
  nAmount = nAmount * 10 ** 4;
  let estimatedGas;
  try {
    estimatedGas = await contract.methods.mint(nAmount).estimateGas({
      from: account,
    });
    console.log("Estimated Gas: ", estimatedGas);

    contract.methods
      .mint(nAmount)
      .send({ gas: estimatedGas, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        //alert("Mint Successfully")
        accepted();
      })
      .catch((err) => {
        console.error(err);
        rejected();

        alert("Error: Failed to Mint");
      });
  } catch (error) {
    console.log(error);
    rejected();
    alert(error);

    return;
  }
});

$("#btn-transfer").on("click", async () => {
  let sAccount = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (!account) {
    alert("Connect to Metamask First!");
    return;
  }
  //console.log(sAccount);
  let sRecipient = $("#to").val();
  let nTokensToTransfer = $("#amount").val();
  if (!web3.utils.isAddress(sRecipient)) {
    alert("Address is not valid!");
    return;
  }
  waiting();

  if (!sRecipient || !nTokensToTransfer || isNaN(nTokensToTransfer)) {
    alert("Receiver Address or amount is not defined");
    return;
  }
  let nEstimateTransfergas;
  nTokensToTransfer = nTokensToTransfer * 10 ** 4;

  try {
    contract.methods
      .transfer(sRecipient, nTokensToTransfer)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        nEstimateTransfergas = Number(gasAmount);
        console.log(gasAmount);
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
        return;
      });

    contract.methods
      .transfer(sRecipient, nTokensToTransfer)
      .send({ gas: nEstimateTransfergas, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("Treansfer Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to Transfer");
        rejected();
      });
  } catch (error) {
    console.log(error);
    rejected();
  }
});

$("#btn-balance").on("click", async () => {
  if (!account) {
    alert("Connect to MetaMask First!");
    return;
  }
  let sSender = $("#account").val();
  if (!web3.utils.isAddress(sSender) || !sSender) {
    alert("Address is not valid!");
    return;
  }

  waiting();

  try {
    contract.methods
      .balanceOf(sSender)
      .call()
      .then(function (info) {
        accepted();
        info = info / 10 ** 4;
        console.log("info: ", info);
        $("#bal").text(info);
        //document.getElementById('bal').innerHTML = info;
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-totalsupply").on("click", async () => {
  if (!account) {
    alert("Connect to MetaMask First!");
    return;
  }
  waiting();

  try {
    contract.methods
      .totalSupply()
      .call()
      .then(function (data) {
        accepted();
        data = data / 10 ** 4;
        console.log("data : ", data);
        $("#total").text(data);
        //document.getElementById("total").innerHTML = data;
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-burn").on("click", async () => {
  if (!account) {
    alert("Connect to MetaMask First!");
    return;
  }

  let nAmount = $("#amts").val();
  waiting();

  if (!nAmount || isNaN(nAmount) || nAmount <= 0) {
    alert("Amount Input is invalid");
    return;
  }
  nAmount = nAmount * 10 ** 4;
  let nEstimateBurngas;
  try {
    contract.methods
      .burn(nAmount)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        nEstimateBurngas = Number(gasAmount);
        console.log(gasAmount);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .burn(nAmount)
      .send({ gas: nEstimateBurngas, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("Burn Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to Burn Tokens");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-allowance").on("click", async () => {
  if (!account) {
    alert("Connect to MetaMask First!");
    return;
  }
  let sOwner = $("#owner").val();
  _spender = $("#spender").val();
  if (!web3.utils.isAddress(sOwner) || !web3.utils.isAddress(_spender)) {
    alert("Address is not valid!");
    return;
  }
  waiting();

  if (!sOwner && !_spender) {
    alert("owner or spender is not specified");
    return;
  }

  contract.methods
    .allowance(sOwner, _spender)
    .call()
    .then(function (data) {
      accepted();
      data = data / 10 ** 4;
      console.log("Data : ", data);
      $("#amountAll").text(data);
    });
});

var _spender;

$("#btn-approve").on("click", async () => {
  if (!account) {
    alert("First Connect to MetaMask!");
    return;
  }
  _spender = $("#spend").val();
  let nAmount = $("#allow_amt").val();
  if (!web3.utils.isAddress(_spender)) {
    alert("Address is not valid!");
    return;
  }
  waiting();

  if (!_spender || !nAmount || isNaN(nAmount)) {
    alert("spender or amount is not defined");
    return;
  }
  nAmount = nAmount * 10 ** 4;
  let nEstimateApprovegas;

  try {
    contract.methods
      .approve(_spender, nAmount)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        nEstimateApprovegas = Number(gasAmount);
        console.log(gasAmount);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .approve(_spender, nAmount)
      .send({ gas: nEstimateApprovegas, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("Approve Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to Approve");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-transferfrom").on("click", async () => {
  let AC = await ethereum.request({
    method: "eth_requestAccounts",
  });

  if (!AC) {
    alert("Connect to MetaMask First!");
    return;
  }

  let sFrom = $("#fromacc").val();
  let sTo = $("#toacc").val();
  let nAmount = $("#amounts").val();
  if (!web3.utils.isAddress(sFrom) || !web3.utils.isAddress(sTo)) {
    alert("Address is not valid!");
    return;
  }

  waiting();

  if (!sFrom || !sTo || !nAmount || isNaN(nAmount)) {
    alert("From or To or Amount is not specified");
    return;
  }
  nAmount = nAmount * 10 ** 4;
  console.log(AC[0]);
  AC = AC[0];
  var estimate;
  try {
    contract.methods
      .transferFrom(sFrom, sTo, nAmount)
      .estimateGas({ from: AC })
      .then(function (gasAmount) {
        estimate = Number(gasAmount);
        console.log(gasAmount);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .transferFrom(sFrom, sTo, nAmount)
      .send({ gas: estimate, from: AC })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("Transfer Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to Transfer");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-increase").on("click", async () => {
  if (!account) {
    alert("Connect To MetaMask First!");
    return;
  }
  let sSpender = $("#spen").val();
  let nAmount = $("#mount").val();
  if (!web3.utils.isAddress(sSpender)) {
    alert("Invalid Address");
    return;
  }
  let estimategas;

  waiting();

  if (!sSpender || !nAmount || isNaN(nAmount)) {
    alert("Spender or amount is not defined");
    return;
  }
  nAmount = nAmount * 10 ** 4;

  try {
    contract.methods
      .increaseAllowance(sSpender, nAmount)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        estimategas = Number(gasAmount);
        console.log(gasAmount);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .increaseAllowance(sSpender, nAmount)
      .send({ from: account, gas: estimategas })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("increased Allowance Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to increase allowance");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-decrease").on("click", async () => {
  if (!account) {
    alert("Connect To MetaMask First!");
    return;
  }
  let sSpender = $("#spdr").val();
  let nAmount = $("#ams").val();
  if (!web3.utils.isAddress(sSpender)) {
    alert("Invalid Address");
    return;
  }

  let gasEstimated;
  waiting();

  if (!sSpender || !nAmount || isNaN(nAmount)) {
    alert("spedner or amount is not defined");
    return;
  }
  nAmount = nAmount * 10 ** 4;

  try {
    contract.methods
      .decreaseAllowance(sSpender, nAmount)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        gasEstimated = Number(gasAmount);
        console.log(gasEstimated);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .decreaseAllowance(sSpender, nAmount)
      .send({ gas: gasEstimated, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("decreased Allowance Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to decrease allowance");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-ownership").on("click", async () => {
  if (!account) {
    alert("Not connected");
    return;
  }

  let newOwner = $("#newOwner").val();

  if (!web3.utils.isAddress(newOwner)) {
    alert("invalid Address");
    return;
  }
  let gasEstimated;
  waiting();

  if (!newOwner) {
    alert("new owner is not defined");
    return;
  }
  try {
    contract.methods
      .transferOwnership(newOwner)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        gasEstimated = Number(gasAmount);
        console.log(gasEstimated);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .transferOwnership(newOwner)
      .send({ gas: gasEstimated, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("transfer ownership Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to transfer ownership");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

$("#btn-renounce").on("click", async () => {
  let gasEstimated;
  waiting();

  try {
    contract.methods
      .renounceOwnership()
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        gasEstimated = Number(gasAmount);
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
        return;
      });

    contract.methods
      .renounceOwnership()
      .send({ gas: gasEstimated, from: account })
      .on("transactionHash", (txHash) => {
        console.log("Transaction Hash: ", txHash);
      })
      .on("receipt", (receipt) => {
        console.log("Receipt", receipt);
        alert("renounce ownership  Successfully");
        accepted();
      })
      .catch((err) => {
        console.error(err);
        alert("Error: Failed to renounce ownership");
        rejected();
      });
  } catch (error) {
    rejected();
    console.log(error);
  }
});

function accepted() {
  $("#msg").removeClass("show");
  $("#msg").addClass("hide");
  $("#msg2").removeClass("hide");
  $("#loader").removeClass("loader");

  setTimeout(() => {
    $("#loader").removeClass("loader");
    $("#msg, #msg2, #msg3,#msg4 ,#loader").addClass("hide");
  }, 5000);
}

function rejected() {
  $("#msg, #msg2").addClass("hide");
  $("#msg,#msg2").removeClass("show");
  $("#msg3").addClass("show");
  $("#msg3").removeClass("hide");
  $("#loader").removeClass("loader");

  setTimeout(() => {
    $("#loader").removeClass("loader");
    $("#msg, #msg2, #msg3,#msg4 ,#loader").addClass("hide");
  }, 5000);
}

function waiting() {
  $("#msg").removeClass("hide");
  $("#msg,#msg2").addClass("show");
  $("#loader").addClass("loader");
}

function hide() {
  $("#msg, #msg2, #msg3,#msg4 ,#loader").addClass("hide");
}
