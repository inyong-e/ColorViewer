const onClickExport = async () => {
  const bodyDOM = await getBodyDOM();
  console.log(bodyDOM);
};

const exportBtn = document.getElementById("export-btn");
exportBtn.addEventListener("click", onClickExport);
