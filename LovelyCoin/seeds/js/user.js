$(document).ready(async function (e) {
  web3 = new Web3(window.web3.currentProvider);

  let oContractObject;
  var oContract;
  let sAccount;
  const BINANCE_CHAINID = `0x${Number(1337).toString(16)}`;

  try {
    console.log("Metamask");
    const web3 = new Web3(window.ethereum);
    if (typeof window.ethereum !== "undefined") {
      console.log("Installed");
    } else {
      console.log("Not Installed");
    }
    const Fetch_sAccountAddress = await ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(Fetch_sAccountAddress);
    console.log(Fetch_sAccountAddress[0]);
    sAccount = `${Fetch_sAccountAddress[0]}`;

    console.log(await ethereum.request({ method: "eth_chainId" }));
    oContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    console.log("Contract Object: ", oContract);
    //checkBalance();
    checkBalances();
  } catch (error) {
    alert("MetaMask Refused to connect");
    window.location.assign("http://localhost:3000/user/signin");
    console.log(error);
  }

  $("#btn-transfercontract").on("click", async function (e) {
    console.log(sAccount);

    if (!sAccount) {
      alert("Connect to metamask First!");
      return;
    }

    let oData = {
      sUserId: sAccount,
      nTokens: $("#amount").val(),
    };
    // let sAccount = await window.ethereum.request({
    //     method: "eth_requestAccounts"
    // })
    //console.log(sAccount);
    let nToken = $("#amount").val();

    if (!nToken || isNaN(nToken)) {
      alert("Please Enter valid Amount!");
      return;
    }
    let nEstimateTransfergas;
    nToken = nToken * 10 ** 4;

    try {
      oContract.methods
        .transfer(ADMIN_CONTRACT_ADDRESS, nToken)
        .estimateGas({ from: sAccount })
        .then(function (gasAmount) {
          nEstimateTransfergas = Number(gasAmount);
          console.log(gasAmount);
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
          return;
        });

      oContract.methods
        .transfer(ADMIN_CONTRACT_ADDRESS, nToken)
        .send({ gas: nEstimateTransfergas, from: sAccount })
        .on("transactionHash", (txHash) => {
          console.log("Transaction Hash: ", txHash);
        })
        .on("receipt", (receipt) => {
          console.log("Receipt", receipt);

          alert("Transfer Successfully");
          $.ajax({
            type: "POST",
            url: "/api/v1/user/transfer",
            data: oData,
            success: function (result, status, xhr) {
              console.log("result =>>>> : ", result);
              return;
            },
            error: function (error) {
              alert("Transaction is Failed");
              return;
            },
          });
          //checkBalance();
          checkBalances();
        })
        .catch((err) => {
          console.error(err);
          alert("Error: Failed to Transfer");
        });
    } catch (error) {
      console.log(error);
    }
  });
  // function checkBalance() {
  //   let oData = {
  //     account: sAccount,
  //   };
  //   console.log("Hello Harami Sharma!", sAccount);

  //   $.ajax({
  //     type: "post",
  //     url: "/api/v1/user/checkBalance",
  //     data: oData,
  //     success: function (result, status, xhr) {
  //       console.log(result);
  //       $("#balance").text(result);
  //     },
  //     error: function (error) {
  //       alert("Can not get data");
  //       return;
  //     },
  //   });
  // }
  async function checkBalances() {
    console.log("check : ", sAccount);
    try {
      await oContract.methods
        .balanceOf(sAccount)
        .call()
        .then(function (info) {
          info = info / 10 ** 4;
          console.log("info: ", info);
          $("#balances").text(info);
          //document.getElementById('bal').innerHTML = info;
          let oData = {
            account: sAccount,
          };
          $.ajax({
            type: "post",
            url: "/api/v1/user/checkBalance",
            data: oData,
            success: function (result, status, xhr) {
              console.log(result);
              $("#balance").text(result);
            },
            error: function (error) {
              alert("Can not get data");
              return;
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
});
