import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { BiCopy, BiUpload, BiBulb } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { BsChatLeftText } from 'react-icons/bs';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMsal } from "@azure/msal-react";
import { GoSignOut } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

import HashLoader from "react-spinners/HashLoader";
import ClipboardJS from "clipboard";
import { GrConfigure } from "react-icons/gr";
import { FcDataConfiguration } from "react-icons/fc";
import { IoSettingsSharp } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.css';
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const examples = [
  "Tell me something about you",
  "How to use Tailwind CSS with React",
  "How to use write a java code",
  "What is Gatsby ",
];
const empid = window.localStorage.getItem('user_id');
const url = "http://localhost:5000";
var model = 1;
console.log(model);

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [title, setTitle] = useState({});
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("");
  const [loader, setLoader] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupvisible, setPopupvisible] = useState(false);
  const [prompt_list, setprompt_list] = useState([]);
  const [files, setfiles] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isLeftHovering, setIsLeftHovering] = useState(false);
  const [isconfigHovering, setIsconfigHovering] = useState(false);
  const [isRightHovering, setIsRightHovering] = useState(false);
  const [options, setOptions] = useState("GPT 3.5 Turbo");
  const [llm_list, setllm_list] = useState([]);
  const [file_upload_option, set_fileUpload] = useState('PDFFILE');
  const [selectUserPrompt, setSelectUserPrompt] = useState('');


  useEffect(() => {
    // console.log('checked prompt', checkedItems)
    onSelectUserPrompt();
  }, [checkedItems])

  const { instance } = useMsal();
  const handleSignOut = () => {
    instance.logoutRedirect();
  }
  const handleLeftMouseEnter = () => {
    setIsLeftHovering(true);
  };

  const handleLeftMouseLeave = () => {
    setIsLeftHovering(false);
  };


  const handleRightMouseEnter = () => {
    setIsRightHovering(true);
  };

  const handleRightMouseLeave = () => {
    setIsRightHovering(false);
  };


  const addconversation = async () => {
    setChat([]);
    const dt = new Date().getTime();
    // console.log('hello', dt)
    const title1 = {
      topic_desc: "New Chat",
      topic_id: dt,
    };
    // console.log('hi', title1.topic_id)

    const ch = chatHistory;
    console.log(dt);
    ch.push(title1);
    setChatHistory([...ch]);
    const t = title1.topic_id;
    // console.log('hiiii', t)
    setSelected(t);
  };

  /*useEffect(() => {
      // This code will run whenever the chat state changes
      console.log("chat in useeffect", chat);
    }, [chat]);*/

  const selectconveration = async (topic_id) => {
    setPopup(false);
    setSelected((prevSelected) => topic_id);
    setChat([]);
    let title1 = [{}];
    console.log("selected" + selected);
    //if(i && selected !== "New Chat"){
    const createTitle1 = await axios
      .get(`${url}/topic/${topic_id}/conversation`, {})
      .then((createTitle1) => {
        title1 = createTitle1.data;
        title1.map((item, index) => {
          const newChat = [
            { role: "user", content: item.request },
            { role: "assistant", content: item.response },
          ];
          setChat((prevChat) => [...prevChat, ...newChat]);
        });
      });
    //  }
  };

  useEffect(() => {
    // console.log("inside useeffect");
    getconverationdata();
  }, []);

  const handleSend = async () => {
    const id = new Date().getTime();
    if (!selected) {
      const id = new Date().getTime();
      setSelected((prevSelected) => id);
    }
    if (input.trim) {
      console.log(input);

      setChat([...chat, { role: "user", content: input }]);
      setInput("");
      let apires = "";
      setLoader(true);
      const response = await axios
        .post(`${url}/response`, {
          topic_id: selected,
          user_id: empid,
          query: input,
          prompt_ids: checkedItems,
          llm_id: model // pass the response value as the prompt parameter
        })
        .then((response) => {
          apires = response;
        });
      setLoader(false);
      setPopup(true);
      //console.log(apires.data);
      if (apires.data.Flag === 1) {
        await getconverationdata();
      }
      setChat([
        ...chat,
        { role: "user", content: input },
        { role: "assistant", content: apires.data.response },
      ]);

      //   let title1 = [];
      //   if (!title) {
      //     //change required here change URL
      //     const createTitle = await axios
      //       .get("http://127.0.0.1:5001/getTitle")
      //       .then((createTitle) => {
      //         title1 = createTitle.data;
      //       });
      //     setTitle(title1?.title1);
      //     setChatHistory([...chatHistory, title]);
      //   }
    }
  };

  const handleCopy = () => {
    const clipboard = new ClipboardJS(".copy-button");
    clipboard.on("success", () => {
      console.log("Copied to clipboard!");
    });
    clipboard.on("error", () => {
      console.log("Failed to copy to clipboard!");
    });
  };



  const renderoutput = (input) => {
    //console.log(input);
    const parts = input.split("```");
    //parts.map(() => {
    // console.log("input :" + parts);
    //});
    return (
      <div style={{ whiteSpace: "break-spaces" }}>
        {parts.map((item, index) =>
          index % 2 === 1 ? (
            //<div className="flex bg-[#050509]">Hi {item}</div>
            <div className="bg-black rounded-lg  ">
              <div className="flex justify-between items-center mb-4 bg-[#41414f] rounded-t-lg p-2">
                <h3 className="text-white text-lg font-bold mr-2  ">
                  {item.substring(0, item.indexOf("\n")) ? (
                    <div>{item.substring(0, item.indexOf("\n"))}</div>
                  ) : (
                    <div>code snippet</div>
                  )}
                </h3>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      item.substring(item.indexOf("\n"), item.length)
                    )
                  }
                >
                  <BiCopy size={23} />
                </button>
              </div>
              <div className="rounded-lg p-2 ">
                <SyntaxHighlighter
                  language={
                    item.substring(0, item.indexOf("\n"))
                      ? item.substring(0, item.indexOf("\n"))
                      : "jsx"
                  }
                  style={atomDark}
                >
                  {item.substring(item.indexOf("\n"), item.length).trim()}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            <div>{item}</div>
          )
        )}
      </div>
    );
  };


  // function for poping up adress uploading popup

  function Upload_Address() {

    var uploader = document.createElement("div");
    uploader.style.justifyContent = "center";
    uploader.style.background = "rgba(0,0,0,0.8)";
    uploader.style.display = "flex";
    uploader.style.flexDirection = "column";
    uploader.style.position = "absolute";
    uploader.style.top = "50%";
    uploader.style.left = "50%";
    uploader.style.height = "100%";
    uploader.style.width = "100%";
    uploader.style.transform = "translate(-50%, -50%)";
    uploader.style.padding = "11% 40%";
    uploader.style.border = "white";

    var uploader1 = document.createElement("div");
    uploader1.style.background = "#41414f";
    uploader1.style.borderRadius = "2px";
    uploader1.style.border = "white";
    uploader1.style.width = "100%";
    uploader1.style.maxheight = "115px";


    var row1 = document.createElement("div");
    row1.style.padding = "2px";
    row1.style.display = "flex";
    row1.style.flexDirection = "column";
    row1.style.alignItems = "center";
    row1.style.marginTop = "5%";

    var row2 = document.createElement("div");
    row2.style.display = "flex";
    row2.style.justifyContent = "space-between";
    row2.style.marginBottom = "5%";

    var upload_button = document.createElement("button");
    var Cancel_button = document.createElement("button");
    var address_Input = document.createElement("input");
    var promt_input = document.createElement("input");

    promt_input.type = "text";
    promt_input.style.width = "90%";
    promt_input.style.marginTop = "10px";
    promt_input.setAttribute("id", "inputprompt");
    promt_input.placeholder = "What do you want me to do with this file";

    address_Input.type = "text";
    address_Input.style.width = "90%";
    address_Input.setAttribute("id", "addressinput");
    address_Input.placeholder = "file address...";
    address_Input.style.padding = "2px";



    Cancel_button.textContent = "close";
    Cancel_button.setAttribute("id", "closebutton");
    Cancel_button.style.cursor = "pointer";
    Cancel_button.style.margin = "10px";
    Cancel_button.style.background = "rgb(65 65 79)";

    upload_button.textContent = "Upload";
    upload_button.setAttribute("id", "Enter");
    upload_button.style.cursor = "pointer";
    upload_button.style.marginLeft = "auto";
    upload_button.style.marginRight = "10px";

    upload_button.style.background = "rgb(65 65 79)";


    row1.appendChild(address_Input);
    row1.appendChild(promt_input);

    row2.appendChild(upload_button);
    row2.appendChild(Cancel_button);
    uploader1.appendChild(row1);
    uploader1.appendChild(row2);
    uploader.appendChild(uploader1)
    document.body.appendChild(uploader);


    // console.log(address_Input2,input_prompt1);
    var close = document.getElementById("closebutton");
    close.addEventListener("click", function () {
      document.body.removeChild(uploader);
    });

    var uplaod_file = document.getElementById("addressinput");
    address_Input.type = "file";
    uplaod_file.addEventListener("input", (event) => {
      setfiles(event.target.files[0]);
      console.log("Div content changed:", event.target.files[0]);
      let reader = new FileReader();
      reader.readAsDataURL(
        new Blob([event.target.files[0]], { type: "application/pdf" })
      );

      reader.onload = (e) => {
        console.log("file data", e.target.result);
        const formdata = { file: e.target.result };
        const response = axios
          .post("http://127.0.0.1:5002/uploadfile", {
            pdf: formdata,
          })
          .then((response) => {
            alert(response.data["message"]);
          });
      };
    });

    var upload_btn = document.getElementById("Enter");
    upload_btn.addEventListener("click", async function () {
      var address_Input1 = document.getElementById("addressinput").value;
      var input_prompt = document.getElementById("inputprompt").value;
      let apires = "";
      // console.log(input_prompt);'
      setChat([...chat, { role: "user", content: input_prompt }]);
      setLoader(true);
      const response = axios
        .get("http://127.0.0.1:5002/callOpenAiFile", {
          params: {
            // Path: address_Input1,
            requestString: input_prompt,
          },
        })
        .then((response) => {
          apires = response
          console.log(apires.data.response)
          setLoader(false);
          setChat([...chat, { role: "user", content: input_prompt }, { role: "assistant", content: apires.data.Response }]);

        });
      document.body.removeChild(uploader);

    });
  }

  const handlecheck1 = (event) => {
    const item = event.target.value;
    console.log('prompt', item)
    const isChecked = event.target.checked;
    setCheckedItems((prevItems) =>
      isChecked ? [...prevItems, item] : prevItems.filter((i) => i !== item)
    );
  };


  function findPromptData(promptId) {
    const prompt = prompt_list.find(item => item.PromptID === promptId);
    if (prompt) {
      return { PromptDesc: prompt.PromptDesc, PromptTitle: prompt.PromptTitle };
    } else {
      return null;
    }
  }
  function Edit_prompt_popup(prompt_id) {

    const promptData = findPromptData(prompt_id);
    var description = "";
    var Title = "";
    if (promptData) {
      console.log(`PromptDesc: ${promptData.PromptDesc}, PromptTitle: ${promptData.PromptTitle}`);
      description = promptData.PromptDesc;
      Title = promptData.PromptTitle;
    }

    var uploader = document.createElement("div");
    uploader.style.justifyContent = "center";
    uploader.style.background = "rgba(0,0,0,0.8)";
    uploader.style.display = "flex";
    uploader.style.flexDirection = "column";
    uploader.style.position = "absolute";
    uploader.style.top = "50%";
    uploader.style.left = "50%";
    uploader.style.height = "100%";
    uploader.style.width = "100%";
    uploader.style.transform = "translate(-50%, -50%)";
    uploader.style.padding = "11% 40%";
    uploader.style.border = "white";

    var uploader1 = document.createElement("div");
    uploader1.style.background = "#41414f";
    uploader1.style.borderRadius = "2px";
    uploader1.style.border = "white";
    uploader1.style.width = "150%";
    uploader1.style.maxheight = "115px";


    var row1 = document.createElement("div");
    row1.style.padding = "2px";
    row1.style.display = "flex";
    row1.style.flexDirection = "column";
    row1.style.alignItems = "center";
    row1.style.marginTop = "5%";

    var row2 = document.createElement("div");
    row2.style.display = "flex";
    row2.style.justifyContent = "space-between";
    row2.style.marginBottom = "5%";

    var Save_button = document.createElement("button");
    var Cancel_button = document.createElement("button");
    var address_Input = document.createElement("input");
    var promt_input = document.createElement("textarea");
    var Delete_prompt = document.createElement("button");

    // promt_input.type = "";
    promt_input.style.width = "90%";
    promt_input.value = description;
    promt_input.style.padding = "3%";
    promt_input.style.marginTop = "10px";
    promt_input.style.marginBottom = "5%";
    promt_input.setAttribute("id", "inputprompt");
    promt_input.style.overflow = "auto";

    address_Input.type = "text";
    address_Input.value = Title;
    address_Input.style.width = "90%";
    address_Input.style.padding = "3%";
    address_Input.setAttribute("id", "Title");
    address_Input.style.marginTop = "5%";
    address_Input.style.marginBottom = "5%";

    Cancel_button.textContent = "Cancel";
    Cancel_button.setAttribute("id", "closebutton");
    Cancel_button.style.cursor = "pointer";
    Cancel_button.style.margin = "10px";
    Cancel_button.style.background = "rgb(65 65 79)";

    Delete_prompt.textContent = "Delete";
    Delete_prompt.setAttribute("id", "delete");
    Delete_prompt.style.cursor = "pointer";
    Delete_prompt.style.margin = "10px";
    Delete_prompt.style.background = "rgb(65 65 79)";

    Save_button.textContent = "Update";
    Save_button.style.border = "1px"
    Save_button.setAttribute("id", "Enter");
    Save_button.style.cursor = "pointer";
    Save_button.style.marginLeft = "auto";
    Save_button.style.marginRight = "10px";

    Save_button.style.background = "rgb(65 65 79)";


    row1.appendChild(address_Input);
    row1.appendChild(promt_input);
    row1.appendChild(Delete_prompt);
    row2.appendChild(Save_button);
    row2.appendChild(Cancel_button);
    row2.appendChild(Delete_prompt);
    uploader1.appendChild(row1);
    uploader1.appendChild(row2);
    uploader.appendChild(uploader1)
    document.body.appendChild(uploader);


    var delete1 = document.getElementById("delete");
    delete1.addEventListener("click", function () {
      setLoader(true);
      const response = axios
        .get("http://127.0.0.1:5002/deletePrompt", {
          params: {
            EmpID: empid,
            promptId: prompt_id.toString()
          }
        }
        )
      setLoader(false);
      getconverationdata();
      document.body.removeChild(uploader);

    })

    var close = document.getElementById("closebutton");
    close.addEventListener("click", function () {
      document.body.removeChild(uploader);
    });

    var upload_btn = document.getElementById("Enter");
    upload_btn.addEventListener("click", async function () {
      var Prompt_title = document.getElementById("Title").value;
      var Prompt_msg = document.getElementById("inputprompt").value;
      setLoader(true);
      const response = axios.put(`${url}/prompt/update`, {
        user_id: empid,
        prompt_title: Prompt_title,
        prompt_desc: Prompt_msg,
        prompt_id: prompt_id.toString(),
      });
      setLoader(false);
      console.log(Prompt_title, Prompt_msg)
      getconverationdata();
      document.body.removeChild(uploader);
    });
  }

  // const Prompt_popup_click = async () => {
  //   // function New_promp_popup(){

  //   var uploader = document.createElement("div");
  //   uploader.style.justifyContent = "center";
  //   uploader.style.background = "rgba(0,0,0,0.8)";
  //   uploader.style.display = "flex";
  //   uploader.style.flexDirection = "column";
  //   uploader.style.position = "absolute";
  //   uploader.style.top = "50%";
  //   uploader.style.left = "50%";
  //   uploader.style.height = "100%";
  //   uploader.style.width = "100%";
  //   uploader.style.transform = "translate(-50%, -50%)";
  //   uploader.style.padding = "11% 40%";
  //   uploader.style.border = "white";

  //   var uploader1 = document.createElement("div");
  //   uploader1.style.background = "#41414f";
  //   uploader1.style.borderRadius = "2px";
  //   uploader1.style.border = "white";
  //   uploader1.style.width = "150%";
  //   uploader1.style.maxheight = "115px";


  //   var row1 = document.createElement("div");
  //   row1.style.padding = "2px";
  //   row1.style.display = "flex";
  //   row1.style.flexDirection = "column";
  //   row1.style.alignItems = "center";
  //   row1.style.marginTop = "5%";

  //   var row2 = document.createElement("div");
  //   row2.style.display = "flex";
  //   row2.style.justifyContent = "space-between";
  //   row2.style.marginBottom = "5%";

  //   var Save_button = document.createElement("button");
  //   var Cancel_button = document.createElement("button");
  //   var address_Input = document.createElement("input");
  //   var promt_input = document.createElement("textarea");

  //   // promt_input.type = "";
  //   promt_input.style.width = "90%";
  //   promt_input.style.padding = "3%";
  //   promt_input.style.marginTop = "10px";
  //   promt_input.style.marginBottom = "5%";
  //   promt_input.setAttribute("id", "inputprompt");
  //   promt_input.placeholder = "Write prompt here";
  //   promt_input.style.overflow = "auto";

  //   address_Input.type = "text";
  //   address_Input.style.width = "90%";
  //   address_Input.style.padding = "3%";
  //   address_Input.setAttribute("id", "Title");
  //   address_Input.placeholder = "Add Prompt Title";
  //   address_Input.style.marginTop = "5%";
  //   address_Input.style.marginBottom = "5%";

  //   Cancel_button.textContent = "Cancel";
  //   Cancel_button.setAttribute("id", "closebutton");
  //   Cancel_button.style.cursor = "pointer";
  //   Cancel_button.style.margin = "10px";
  //   Cancel_button.style.background = "rgb(65 65 79)";

  //   Save_button.textContent = "Save";
  //   Save_button.style.border = "1px"
  //   Save_button.setAttribute("id", "Enter");
  //   Save_button.style.cursor = "pointer";
  //   Save_button.style.marginLeft = "auto";
  //   Save_button.style.marginRight = "10px";

  //   Save_button.style.background = "rgb(65 65 79)";


  //   row1.appendChild(address_Input);
  //   row1.appendChild(promt_input);

  //   row2.appendChild(Save_button);
  //   row2.appendChild(Cancel_button);
  //   uploader1.appendChild(row1);
  //   uploader1.appendChild(row2);
  //   uploader.appendChild(uploader1)
  //   document.body.appendChild(uploader);

  //   var close = document.getElementById("closebutton");
  //   close.addEventListener("click", function () {
  //     document.body.removeChild(uploader);
  //   });

  //   var upload_btn = document.getElementById("Enter");
  //   upload_btn.addEventListener("click", async function () {
  //     var Prompt_title = document.getElementById("Title").value;
  //     var Prompt_msg = document.getElementById("inputprompt").value;
  //     // const Prompt_id = new Date().getTime();
  //     setLoader(true);
  //     const response = axios
  //       .post("http://127.0.0.1:5002/addPrompt", {
  //         EmpID: empid,
  //         Prompt: {
  //           promptTitle: Prompt_title,
  //           promptDesc: Prompt_msg,
  //           // promptId: Prompt_id.toString()
  //         }

  //       })

  //     //  setprompt_list([...prompt_list, { Topic: "user", content: input }]);

  //     setLoader(false);
  //     getconverationdata();
  //     document.body.removeChild(uploader);


  //   });
  // }
  // console.log(checkedItems)



  // Add Prompt Model function Start
  async function savePromt() {
    let prompt_title = document.getElementById('promptTitle').value;
    console.log('title msg', prompt_title);
    let prompt_input = document.getElementById('inputPrompt').value;
    console.log('input msg', prompt_input);
    if (!prompt_title || !prompt_input) {
      return alert('please provide some value');
    };

    const prompt_id = new Date().getTime();
    setLoader(true);
    const response = axios.put(`${url}/prompt/update`, {
      user_id: empid,
      prompt_title: prompt_title,
      prompt_desc: prompt_input,
      prompt_id: prompt_id.toString(),
    });

    setLoader(false);
    console.log('hi', response)
    document.getElementById('promptTitle').value = "";
    document.getElementById('inputPrompt').value = "";
    await getconverationdata();
  };

  // radio btn for upload file

  // Admin Prompt List function End

  // Admin Prompt List function start

  // function adminPromptList() {
  //   const prompt_id = new Date().getTime();
  //   setLoader(true);
  //   const response = axios.get(`${url}/admin/prompt`, {
     
  //   });
  // }

  // Admin Prompt List function end

  // select userPrompt function start
  function onSelectUserPrompt(){
    let selecPrompt = '';
    console.log('checked prompt', checkedItems)
    for(let i = 0; i < checkedItems.length; i++){
      console.log('selected item', checkedItems[i]);
      for(let j = 0; j < prompt_list.length; j++){
        console.log('selected item', prompt_list[j]);
        if(prompt_list[j].prompt_id === checkedItems[i]){
          selecPrompt = selecPrompt + prompt_list[j].prompt_desc + "\n";
        }
      }
    }
    console.log('user select',selecPrompt);
    setInput(selecPrompt);
  }
  // select userPrompt function END


  function Compare_popup() {
    // Create a container element for the flex screen
    var container = document.createElement("div");

    container.style.background = "rgba(0,0,0,0.8)"
    container.style.display = "flex";
    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.padding = "5% 15%";
    container.style.border = "white";

    // Create three column elements
    var column1 = document.createElement("div");
    column1.style.flex = "1";
    column1.style.display = "block";
    //  column1.textContent = "THIS IS SIDE 1 EUUU";
    column1.style.borderTopLeftRadius = "4px";
    column1.style.borderBottomLeftRadius = "4px";
    column1.style.color = "white";
    column1.style.borderWidth = "1px";
    column1.style.borderColor = "white";
    column1.style.background = "rgb(5 5 9)";

    var column2 = document.createElement("div");
    column2.style.flex = "1";
    column2.style.display = "block";
    column2.style.color = "white";
    column2.style.borderTopRightRadius = "4px";
    column2.style.borderBottomRightRadius = "4px";
    //column2.textContent = "THIS IS SIDE 2 EUUU";
    column2.style.borderWidth = "1px";
    column2.style.borderColor = "white";
    column2.style.background = "rgb(5 5 9)";

    var column1_1 = document.createElement("div");
    column1_1.style.flex = "1";
    column1_1.style.display = "flex";
    column1_1.style.color = "white";
    column1_1.style.borderWidth = "1px";
    column1_1.style.borderColor = "white";
    column1_1.style.background = "rgb(65 65 79)";

    var LLM_list = ["option1", "option2", "option3"];


    var column1_2 = document.createElement("select");
    column1_2.style.background = "rgb(12 23 42)";
    column1_2.style.textAlign = "center";
    column1_2.style.paddingTop = "1%";
    column1_2.style.paddingBottom = "1%";
    column1_2.style.width = "100%";

    for (var i = 0; i < LLM_list.length; i++) {
      var option = document.createElement("option");
      option.value = LLM_list[i];
      option.textContent = LLM_list[i];
      column1_2.appendChild(option)
    }



    var column2_1 = document.createElement("div");
    column2_1.style.flex = "1";
    column2_1.style.display = "flex";
    column2_1.style.justifyContent = "Space-around";
    column2_1.style.color = "white";
    column2_1.style.borderWidth = "1px";
    column2_1.style.borderColor = "white";
    column2_1.style.background = "rgb(12 23 42)";

    var column2_3 = document.createElement("select");
    column2_3.style.background = "rgb(15 23 42)";
    column2_3.style.textAlign = "center";
    column2_3.style.paddingTop = "1%";
    column2_3.style.paddingBottom = "1%";
    column2_3.style.width = "93%";

    for (var j = 0; j < LLM_list.length; j++) {
      var option2 = document.createElement("option");
      option2.value = LLM_list[j];
      option2.textContent = LLM_list[j];
      column2_3.appendChild(option2)
    }

    var column2_2 = document.createElement("button");
    column2_2.textContent = "X";
    column2_2.setAttribute("id", "myButton");
    column2_2.style.cursor = "pointer";
    column2_2.style.background = "rgb(65 65 79)";
    column2_2.style.right = "0px";
    // column2_2.style.borderWidth="px";
    // Append the column elements to the container
    container.appendChild(column1);
    container.appendChild(column2);
    column1.appendChild(column1_1);
    column1_1.appendChild(column1_2);
    column2.appendChild(column2_1);
    column2_1.appendChild(column2_3);
    column2_1.appendChild(column2_2);
    // container.appendChild(column3);
    document.body.appendChild(container);

    var close = document.getElementById("myButton");
    close.addEventListener("click", function () {
      document.body.removeChild(container);
    });

  }

  const popupscreen = async () => {
    console.log("inside popupscreen");
    var elements = document.querySelectorAll(".cursor-pointer");
    console.log(elements)
    elements[4].addEventListener("click", Compare_popup());
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInput(input + "\n");
    } else if (e.key === "Enter" && e.shiftKey) {
      //e.preventDefault();
      const c = input.trim() ? handleSend() : undefined;
    }
  };

  const handledelete_history = async (topic_id, topic_desc) => {
    if (topic_desc != "New Chat") {
      const createTitle1 = await axios.put(`${url}/topic/update`, {
        user_id: empid,
        topic_id: topic_id,
      });
      setSelected();
      getconverationdata();
    } else {
      getconverationdata();
    }
  };

  const getconverationdata = async () => {
    setChat([]);
    let title1;
    let title2;
    let title3;
    console.log(title1);
    const topics = await axios
      .get(`${url}/user/${empid}/topic`, {})
      .then((response) => {
        console.log(response.data[0]);
        title1 = response.data;
      });

    const prompts = await axios
      .get(`${url}/user/${empid}/prompt`, {})
      .then((response) => {
        console.log(response.data[0]);
        title2 = response.data;
        console.log('prompt data', response.data);
      });

    const llm_lists = await axios
      .get(`${url}/llm_list`, {})
      .then((response) => {
        console.log(response.data[0]);
        title3 = response.data;
      });

    // console.log(title2)
    await setTitle(title1);
    setprompt_list([]);
    setprompt_list(title2);
    await setChatHistory(title1);
    setllm_list(title3);
    console.log(chatHistory);
  };

  const handleDropChange = (event) => {
    setOptions(event.target.value);
    model = event.target.value;
    console.log(model);
  }

  return popupvisible ? (
    <div>
      <h1>
        {console.log("Hi this is for testing" + popupvisible)}this is for test
      </h1>
    </div>
  ) : (
    // <div className=" h-screen w-screen flex bg-[#050509] ">
    <div className="container-fluid main-wrapper row g-0">
      {/* <div className=" w-[20%] h-screen bg-[#0c0c15] text-white p-4">   */}
      <div className="left-sidebar col-2 position-relative">
        {/* <div className=" h-[10%]"> */}
        <div className="">
          <div>{(!selected || selected === "") && addconversation()}</div>
          <button
            className=" w-full new-chat-btn"
            onClick={addconversation} //addconversation  handleSend_demo
          >
            <span>
              <svg width="24"
                height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V17M7 12H17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </span>
            <span>New Chat</span>
          </button> {/*h-[50px] border rounded hover:bg-slate-600*/}
        </div>
        {/* <div className=" h-[70%] overflow-scroll shadow-lg hide-scroll-bar mb-4"> */}
        <div className="chat-chip-btn chat-chip-btn-wrapper mt-4">
          {chatHistory.map((item, index) => (
            <ol>
              <li
                onClick={() => {
                  item.Topic != "New Chat" &&
                    selectconveration(item.topic_id);
                }}>
                {selected === item.topic_id ? (
                  <div className="chat-chip-wrapper text-center text-lg font-light flex items-center justify-between">
                    <div className="flex flex-row">
                      <div className="m-2">
                        <BsChatLeftText />
                      </div>
                      <span className="chat-chip-label text-left">{item.topic_desc}</span>
                    </div>
                    <div>
                      <button data-bs-toggle="modal" data-bs-target="#chatTitleModal" >
                        {/* <FaTrash /> */}
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                      </button>

                    </div>

                  </div>
                ) : (
                  <div className="chat-chip-hover text-center  text-lg font-light flex items-center justify-between">
                    <div className="flex flex-row">
                      <div className="m-2">
                        <BsChatLeftText />
                      </div>
                      <span className="chat-chip-label text-left">{item.topic_desc}</span>
                    </div>
                    <div>
                      <button data-bs-toggle="modal" data-bs-target="#chatTitleModal">
                        {/* <FaTrash /> */}
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ol>
          ))}
        </div>
        {/* <div className="overflow-scroll shadow-lg hide-scroll-bar h-[20%] border-t"> */}
        <div className="logout-wrapper">
          <div className="">
            {[1].map((item, index) => (
              // <div className=" py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer">
              <div className="d-inline-flex" onClick={handleSignOut}>
                <span className="me-3">
                  {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-settings-code"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M11.482 20.924a1.666 1.666 0 0 1 -1.157 -1.241a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.312 .318 1.644 1.794 .995 2.697"></path>
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                  <path d="M20 21l2 -2l-2 -2"></path>
                  <path d="M17 17l-2 2l2 2"></path>
                </svg> */}

                  <svg viewBox="0 0 1024 1024" class="icon" width="24"
                    height="24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z" fill="#4A5699"></path><path d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z" fill="#C45FA0"></path><path d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z" fill="#E5594F"></path></g></svg>
                </span>
                Log Out
              </div>
            ))}
          </div>
        </div>

      </div>



      {/* <div className=" w-[60%]"> */}
      <div className="chat-wrapper col-8 position-relative ">
        {chat.length > 0 ? (
          <div className=" h-[85%] overflow-scroll hide-scroll-bar pt-8">
            {chat.map((item, index) => (
              <div
                className={` w-[95%] mx-auto p-6 text-black flex ${item.role === "assistant" && "response-chat-wrapper rounded"
                  }`}
              >
                <span className=" mr-8 p-2 bg-slate-500 text-white rounded-full h-full ">
                  {item.role === "user" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-user-bolt"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
                      <path d="M19 16l-2 3h4l-2 3"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-tabler icon-tabler-robot"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z"></path>
                      <path d="M10 16h4"></path>
                      <circle
                        cx="8.5"
                        cy="11.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                      <circle
                        cx="15.5"
                        cy="11.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                      <path d="M9 7l-1 -4"></path>
                      <path d="M15 7l1 -4"></path>
                    </svg>
                  )}
                </span>
                <div
                  className=" leading-loose overflow-x-auto"
                  style={{ whiteSpace: "break-spaces" }}
                >
                  {renderoutput(item.content)}
                </div>
              </div>
            ))}
            {/* {popup ? (
              <div className="flex items-center justify-end p-6">
                <span
                  className="cursor-pointer" id="bulb" onClick={() => popupscreen()}
                >
                  {console.log("popup:" + popup)}
                  <BiBulb className="text-white" size={40} />
                  
                </span>
                cursor-pointer
              </div>
            ) : undefined} */}

          </div>
        ) : (
          // <div className=" h-[80%] flex flex-col justify-center items-center text-white">
          <div className=" ">
            <div className="top-default-heading-wrapper">
              <div className="font-bold main-top-heading">
                GenAI Conversational Interface
              </div>
              {/* <p className="main-top-sub-heading">
                Get started with new modern AI that help you to<br></br>
                simulate your text to your favorite characters
              </p> */}
            </div>
            <div className="justify-content-center d-flex d-none">
              <div className=" flex flex-wrap justify-around max-w-[900px]">
                {examples.map((item, index) => (
                  <div
                    className=" text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] "
                    onClick={() => setInput(item)}
                  >
                    {item}
                  </div>
                ))}{/* hover:bg-slate-800*/}
              </div>
            </div>
          </div>
        )}
        {/* <div className=" h-[20%]"> */}
        <div className="">
          {/* <div className=" flex flex-row items-center justify-center w-full h-full text-white"> */}
          <div className="chat-input-box-wrapper row">
            <div className="col-1 chat-input-msg-icon">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg>
            </div>
            {/* <div className=" w-[60%] flex justify-center relative"> */}
            {/* <div className="chat-input-box ">
            
            </div>  */}
            <textarea
              id="checkedPrompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input-box col-9 rounded-lg p-2 pr-16 hide-scroll-bar"
              placeholder="Type your message here..."
            />
            {/* <div className="w-[10%] flex relative"> */}

            <div className="input-icon-wrapper d-flex col-2">
              <span
                className="cursor-pointer"
                onClick={() => (input.trim() ? handleSend() : undefined)}
              >
                {loader ? (
                  <div className="flex flex-col items-center justify-center">
                    <HashLoader color="#36d7b7" size={30} />
                    {/* <BeatLoader color="#36d7b7" />*/}
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-send"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 14l11 -11"></path>
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                  </svg>
                )}
              </span>

              <span className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#fileUploadModal">

                {/* <BiUpload size={30} /> */}
                <img className="sharepoint-icon" src="/images/file-upload.png" alt="file upoload" />

              </span>
              <span className="cursor-pointer" data-bs-toggle="modal" data-bs-target="#sharePointModal">
                <img className="sharepoint-icon" src="/images/ms-sharepoint.png" alt="sharepoint" />
              </span>

            </div>
          </div>
        </div>
      </div>




      {/* <div className=" w-[20%] h-screen bg-[#0c0c15] text-white p-4"> */}
      <div className=" right-sidebar col-2">
        <Tabs>
          <Tab eventKey="Prompt" title="Prompt">
            <Container>
              <Row>
                <Col className="p-0">
                  <div>
                    <Accordion> {/*defaultActiveKey="0"*/}
                      <Accordion.Item className="mb-2" eventKey="0">
                        <Accordion.Header>Standard Prompt</Accordion.Header>
                        <Accordion.Body className="standard-body-wrapper">
                          <p>
                            <span className=" mr-4">
                              <input type="checkbox" className="transform scale-150"></input>
                            </span>
                            <label data-bs-toggle="modal" data-bs-target="#adminPromptModal">Test 1</label>
                          </p>
                          {/* admin prompt model start */}

                          <div class="modal fade" id="adminPromptModal" tabindex="-1" aria-labelledby="adminPromptModalLabel" aria-hidden="true">
                            <div class="modal-dialog position-relative">
                              <div className="position-absolute close-btn">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-content px-4 py-2 rounded-0">
                                <div class="modal-header d-block border-0 pb-0 text-left">
                                  <h5 class="modal-title" id="adminPromptModalLabel">Admin Prompt</h5>
                                  <p>Read your admin prompt title and prompt.</p>
                                </div>
                                <div class="modal-body">
                                  <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="adminPromptTitle" placeholder="Prompt title" />
                                    <label for="adminPromptTitle">Prompt Title</label>
                                  </div>
                                  <div class="form-floating mt-4">
                                    <textarea class="form-control" placeholder="Prompt" id="adminPrompt"></textarea>
                                    <label for="adminPrompt">Your Prompt</label>
                                  </div>
                                </div>
                                <div class="modal-footer border-0">
                                  <button type="button" class="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* admin prompt model end */}
                        </Accordion.Body>
                      </Accordion.Item>

                      <Accordion.Item className="mb-2" eventKey="1">
                        <Accordion.Header>Userdefined prompt</Accordion.Header>
                        <Accordion.Body className="userdefined-body-wrapper">
                          <div>
                            <div className="chat-chip-btn mb-3 ">
                              <span className="">
                                <button data-bs-toggle="modal" data-bs-target="#promptModal"
                                  className="w-full new-chat-btn" id="New_Prompt"
                                //addconversation  handleSend_demo
                                >
                                  <span>
                                    <svg width="24"
                                      height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V17M7 12H17" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                  </span>
                                  <span>New Prompt</span>
                                </button>
                              </span>
                            </div>


                            <div className="chat-chip-btn-wrapper">
                              {prompt_list.map((item, index) => (
                                <span className="chat-list-item" key={item.prompt_id}>
                                  {/* <div className=" py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600  cursor-pointer justify-between"> */}
                                  <span className="chat-chip-hover text-center  text-lg font-light flex items-center justify-between">
                                    <span className="flex flex-row">
                                      <span className=" mr-4">
                                        <input
                                          id={item.prompt_id}
                                          type="checkbox"
                                          value={item.prompt_id}
                                          className="transform scale-150"
                                          onChange={handlecheck1}
                                          checked={checkedItems.includes(item.prompt_id)}
                                        ></input>
                                      </span>
                                      <label for={item.prompt_id} className="chat-chip-label text-left">{item.prompt_title} </label>
                                    </span>
                                    <span>
                                      <PromptModel setLoader={setLoader} getconverationdata={getconverationdata} prompt={item} />
                                    </span>

                                  </span>

                                </span>

                              ))}

                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="Configuration" title="Configuration" className="configure-wrapper mx-2">
            <div class="form-floating">
              <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                <option value="1">GPT 3.5 Turbo</option>
                <option value="2">GPT 4</option>
              </select>
              <label for="floatingSelect">Choose Model</label>
            </div>
          </Tab>
        </Tabs>


        {/* Prompt Model  */}
        {/* <button   type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#promptModal">
            Prompt modal
        </button> */}

        <div class="modal fade" id="promptModal" tabindex="-1" aria-labelledby="promptModalLabel" aria-hidden="true">
          <div class="modal-dialog position-relative">
            <div className="position-absolute close-btn">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-content px-4 py-2 rounded-0">
              <div class="modal-header d-block border-0 pb-0">
                <h5 class="modal-title" id="promptModalLabel">Prompt</h5>
                <p>Please write your prompt title and prompt for your choice.</p>
              </div>
              <div class="modal-body">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="promptTitle" placeholder="Prompt title" />
                  <label for="promptTitle">Prompt Title</label>
                </div>
                <div class="form-floating mt-4">
                  <textarea class="form-control" placeholder="Write Your Prompt" id="inputPrompt"></textarea>
                  <label for="inputPrompt">Write Your Prompt</label>
                </div>
              </div>
              <div class="modal-footer border-0">
                <button data-bs-dismiss="modal" onClick={savePromt} id="savePrompt" type="button" class="btn btn-outline-primary px-5">Save</button>
                <button type="button" class="btn border-0 pe-0" onClick={() => {
                  document.getElementById('promptTitle').value = "";
                  document.getElementById('inputPrompt').value = "";
                }} data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-3 px-2">jgjg</div> */}

        {/* Prompt Edit Model  */}

        {/* <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#promptEditModal">
            Prompt Edit modal
          </button> */}



        {/* File Upload Model  */}

        {/* <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#fileUploadModal">
            File Upload Model
          </button> */}


        <div className="modal fade" id="fileUploadModal" tabindex="-1" aria-labelledby="fileUploadModalLabel" aria-hidden="true">
          <div className="modal-dialog position-relative">
            <div className="position-absolute close-btn">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-content px-4 py-2 rounded-0">
              <div className="modal-header d-block border-0 pb-0">
                <h5 className="modal-title" id="fileUploadModalLabel">File Upload</h5>
                <p>Please Upload your file and write your question.</p>
              </div>

              <div className="d-flex mb-3">
                <div className="form-check">
                  <input onChange={(e) => { if (e.target.checked) set_fileUpload('PDFFILE') }} className="form-check-input pdf-upload" type="radio" name="action" id="flexRadioDefault1" defaultChecked />
                  <label class="form-check-label" for="flexRadioDefault1">
                    .PDF
                  </label>
                </div>
                <div className="form-check ms-3">
                  <input onChange={(e) => { if (e.target.checked) set_fileUpload('PDFLINK') }} className="form-check-input pdf-link" type="radio" name="action" id="flexRadioDefault2" />
                  <label class="form-check-label" for="flexRadioDefault2">
                    .PDF Link
                  </label>
                </div>
              </div>
              {
                file_upload_option === "PDFFILE" ?
                  <div id="pdfUpload" className="">
                    <div className="modal-body file-upload-wrapper">
                      <div className="form-floating mb-3">
                        <input type="file" class="form-control position-relative" id="formFile" placeholder="Prompt title" />
                        <label for="formFile">File Path/Address</label>
                        <img className="sharepoint-icon" src="/images/file-upload.png" alt="file upoload" />
                      </div>
                      <div class="form-floating mt-4">
                        <textarea className="form-control" placeholder="Write Your Prompt" id="floatingTextarea" ></textarea>
                        <label for="floatingTextarea">What do you want to do with this file?</label>
                      </div>
                    </div>
                    <div class="modal-footer border-0">
                      <button type="button" className="btn btn-outline-primary px-5">Upload</button>
                      <button type="button" className="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
                    </div>
                  </div>
                  :
                  <div id="pdfLink" className="">
                    <div className="modal-body file-upload-wrapper ">
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control position-relative" id="floatingInput" placeholder="PDF Link" />
                        <label for="floatingInput">PDF URL Link</label>
                        <img className="sharepoint-icon" src="/images/link-share.png" alt="file upoload" />
                      </div>
                      <div className="form-floating mt-4">
                        <textarea className="form-control" placeholder="Write Your Prompt" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">What do you want to do with this file?</label>
                      </div>
                    </div>
                    <div className="modal-footer border-0">
                      <button type="button" className="btn btn-outline-primary px-5">Upload</button>
                      <button type="button" className="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>

        {/* sharepoint File Upload Model  */}

        {/* <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#sharePointModal">
            Sharepoint File Link modal
          </button> */}

        <div className="modal fade" id="sharePointModal" tabindex="-1" aria-labelledby="sharePointModalLabel" aria-hidden="true">
          <div className="modal-dialog position-relative">
            <div className="position-absolute close-btn">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-content px-4 py-2 rounded-0">
              <div className="modal-header d-block border-0 pb-0">
                <h5 className="modal-title" id="sharePointModalLabel">File Link</h5>
                <p>Please link your file and write your question.</p>
              </div>
              <div className="modal-body file-upload-wrapper ">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control position-relative" id="floatingInput" placeholder="Prompt title" />
                  <label for="floatingInput">Sharepoint URL Link</label>
                  <img className="sharepoint-icon" src="/images/link-share.png" alt="file upoload" />
                </div>
                <div className="form-floating mt-4">
                  <textarea className="form-control" placeholder="Write Your Prompt" id="floatingTextarea"></textarea>
                  <label for="floatingTextarea">What do you want to do with this file?</label>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-primary px-5">Upload</button>
                <button type="button" className="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>


        {/* <button type="button" class="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#chatTitleModal">
            Chat Title Model
          </button> */}

        <div className="modal fade" id="chatTitleModal" tabindex="-1" aria-labelledby="chatTitleModalLabel" aria-hidden="true">
          <div className="modal-dialog position-relative">
            <div className="position-absolute close-btn">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-content px-4 py-2 rounded-0">
              <div className="modal-header d-block border-0 pb-0">
                <h5 className="modal-title" id="chatTitleModalLabel">Chat Title</h5>
                <p><strong>Note:</strong> Delete title will delete your chat also form the app</p>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInput" placeholder="Chat title" />
                  <label for="floatingInput">Chat Title</label>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-primary px-5">Save</button>
                <button type="button" className="btn border-0 pe-0 text-danger">Delete</button>
                <button type="button" className="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>



        {/* <div className=" h-[10%]"> */}

        {/* <div className=" h-[70%] overflow-scroll shadow-lg hide-scroll-bar mb-4"> */}

      </div>
    </div>
  );
};

export default Chat;

const PromptModel = (props) => {
  const { prompt, setLoader, getconverationdata } = props;
  // Update Prompt Model function Start
  const [promptData, setPromptData] = useState(prompt);
  function handleChange (value) {
    // console.log('prompt data', e.target, promptData)
    setPromptData({
      // ...promptData,value,
      // [e.target.name]: e.target.value,
      prompt_title: value,
    })
    // console.log('prompt data', promptData)
    // var Prompt_title = document.getElementById("Title").value;
    // var Prompt_msg = document.getElementById("inputprompt").value;
    // const Prompt_id = new Date().getTime();
  }

  function handleChange (e) {
    setPromptData((prev)=>{return {...prev,[e.target.name]:e.target.value}})
  }
  
  async function updatePrompt() {
    // console.log('prompt data', promptData)
    
    // const Prompt_id = promptId;
    // console.log('prompt id', promptId)
    setLoader(true);
    const response = axios.put(`${url}/prompt/update`, {
        user_id: empid,
        prompt_title: promptData.prompt_title,
        prompt_desc:promptData.prompt_desc,
        prompt_id: props.prompt.prompt_id.toString(),
    })
    setLoader(false);
    await getconverationdata();
  };
  // console.log('hiii', prompt)


  

  // Update Prompt Model function End
  return (
    <div>
      <span>
        <button data-bs-toggle="modal" data-bs-target={`#promptEditModal${prompt.prompt_id}`} >
          < MdEdit />
        </button>
      </span>
      <div className="modal fade" id={`promptEditModal${prompt.prompt_id}`} tabindex="-1" aria-labelledby="promptEditModalLabel" aria-hidden="true">
        <div className="modal-dialog position-relative">
          <div className="position-absolute close-btn">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-content px-4 py-2 rounded-0">
            <div className="modal-header d-block border-0 pb-0 text-left">
              <h5 className="modal-title" id="promptEditModalLabel">Prompt</h5>
              <p>Please write your prompt title and prompt for your choice.</p>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input type="text" class="form-control" value={promptData.prompt_title} onChange={(e)=>handleChange(e)} name="prompt_title" id="Title" placeholder="Prompt title" />
                <label for="Title">Prompt Title</label>
              </div>
              <div className="form-floating mt-4">
                <textarea className="form-control" value={promptData.prompt_desc} onChange={(e)=>handleChange(e)} name={"prompt_desc"} placeholder="Write Your Prompt" id="inputprompt"></textarea>
                <label for="inputprompt">Write Your Prompt</label>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" onClick={()=>updatePrompt()} data-bs-dismiss="modal" className="btn btn-outline-primary px-5">Update</button>
              <button type="button" className="btn border-0 pe-0 text-danger">Delete</button>
              <button type="button" onClick={()=>setPromptData(prompt)} className="btn border-0 pe-0" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
