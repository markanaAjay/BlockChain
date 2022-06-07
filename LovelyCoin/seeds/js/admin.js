$(document).ready(async function (e) {
  web3 = new Web3(window.web3.currentProvider);

  var oContract;
  let sAccount;
  let oAdminContract;
  const BINANCE_CHAINID = `0x${Number(1337).toString(16)}`;

  //   async function metamaskCheck() {
  //     try {
  //       if (window.ethereum != "undefined") {
  //         oWeb3 = new Web3(window.ethereum);
  //         console.log("Metamask is installed");
  //         const aReqAccount = await ethereum.request({
  //           method: "eth_requestAccounts",
  //         });
  //         console.log(`Connected to ${aReqAccount} account`);
  //         return aReqAccount;
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   $("#btn-connect").on("click", async () => {
  //     try {
  //       metamaskCheck();

  //       let reqChainId = await window.ethereum.request({
  //         method: "eth_chainId",
  //       });

  //       console.log(`Metamask is connected to ${reqChainId} chain ID`);

  //       try {
  //         await window.ethereum.request({
  //           method: "wallet_switchEthereumChain",
  //           params: [{ chainId: BINANCE_CHAINID }],
  //         });
  //         aReqAccount = await window.ethereum.request({
  //           method: "eth_requestAccounts",
  //         });
  //         sAccount = aReqAccount[0];
  //         console.log("Account address: ", sAccount.toString());

  //         finalChainId = await window.ethereum.request({
  //           method: "eth_chainId",
  //         });

  //         console.log(`Connected metamask account: ${finalChainId}`);
  //       } catch (error) {
  //         console.log(error);
  //       }

  //       oContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  //       oAdminContract = new web3.eth.Contract(ADMIN_ABI, ADMIN_CONTRACT_ADDRESS);

  //       console.log("Contract Object: ", oContract);
  //       console.log("admin-contract", oAdminContract);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });

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
    // console.log(Fetch_sAccountAddress);
    // console.log(Fetch_sAccountAddress[0]);
    sAccount = `${Fetch_sAccountAddress[0]}`;

    console.log(await ethereum.request({ method: "eth_chainId" }));
    oContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    oAdminContract = new web3.eth.Contract(ADMIN_ABI, ADMIN_CONTRACT_ADDRESS);

    //console.log("Contract Object: ", oContract);
  } catch (error) {
    alert("MetaMask Refused to connect");
    //window.location.assign("http://localhost:3000/user/signin");
    console.log(error);
  }

  $("#btn-balance").on("click", async function (e) {
    if (!sAccount) {
      alert("Connect to metamask First!");
      return;
    }

    oAdminContract.methods
      .balanceOf()
      .call()
      .then(function (nResult) {
        console.log("result : ", nResult);
        nResult = nResult / 10 ** 4;
        $("#bal").text(nResult);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  $("#btn-withdraw").on("click", async function (e) {
    console.log("Withdraw clicked!");

    if (!sAccount) {
      alert("connect to metamask!");
      return;
    }

    let sUserAccount = $("#account").val();
    console.log("accounts", sUserAccount);

    if (!web3.utils.isAddress(sUserAccount)) {
      alert("address is invalid or empty");
      return;
    }

    let oData = {
      userAccount: sUserAccount,
    };

    $.ajax({
      type: "POST",
      url: "/api/v1/admin/adminData",
      data: oData,
      success: function (result, status, xhr) {
        console.log("result =>>>> : ", result);
        result = result * 10 ** 4;
        if (result <= 0) {
          alert("already withdrawed");
          return;
        }
        oAdminContract.methods
          .withdraw(sUserAccount, result)
          .send({ from: sAccount })
          .on("transactionHash", (txHash) => {
            console.log("Transaction Hash: ", txHash);
          })
          .on("receipt", (receipt) => {
            console.log("Receipt", receipt);
            alert("withdraw Successfully");
            $.ajax({
              type: "delete",
              url: "/api/v1/admin/deleteData",
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
          })
          .catch((err) => {
            console.error(err);
            alert("Error: Failed to withdraw");
          });
      },
      error: function (error) {
        alert("Transaction is Failed");
        return;
      },
    });
  });
});
