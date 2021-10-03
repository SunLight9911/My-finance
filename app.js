//Дэлгэцтэй ажиллах контроллер
var uiController=(function(){
  var DOMstrings={
    inputType:".add__type",
    inputDescription:".add__description",
    inputValue:".add__value",
    addBtn:".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel:".budget__value",
    incomeLabel:".budget__income--value",
    expenseLabel:".budget__expenses--value",
    percentageLabel:".budget__expenses--percentage",
    containerDiv:".container",
    expensePercentageLabel:".item__percentage",
    dateLabel:".budget__title--month"
  };
  var nodeListForEach = function(list , callback){
    for(var i=0; i<list.length ; i++){
      callback(list[i],i);
    }
  };
  var formatMoney= function(too,type){
     too = ""+too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count=1;
    for(var i=0;i<x.length; i++){
      y= y+[i];
      if(count%3===0) y=y+",";
      count++;
    }
    var z= y.split("").reverse().join("");
    if(z[0]===",")
    z=z.substr(1,z.length-1);
    if(type==="inc") z= "+ "+z;
    else z = "- "+z;
    return z;

  };
return{
  displayMonth:function(){
      var unuudur = new Date()
      document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getFullYear()+"оны "+unuudur.getMonth()+"сар-ийн ";
  },
  getInput:function(){
    return {
      type: document.querySelector(DOMstrings.inputType).value,
      description: document.querySelector(DOMstrings.inputDescription).value,
      value:parseInt(document.querySelector(DOMstrings.inputValue).value)
    };
  },
  displayPercentages: function(allPercentages){
     var elements =  document.querySelectorAll(DOMstrings.expensePercentageLabel);

     //элемэнт болгоны хувьд зарлагын хувийг массиваас авч шивж оруулах
     nodeListForEach(elements ,function(el ,index){
       el.textContent = allPercentages[index];
     })

  },
  changeType:function(){
    var fields = document.querySelectorAll(DOMstrings.incomeLabel+","
              +DOMstrings.inputDescription+","
              +DOMstrings.inputValue);

          nodeListForEach(fields , function(el){
            el.classList.toggle("red-focus");
          })
          document.querySelector(DOMstrings.addBtn).classList.toggle("red");
  },
  getDOMstrings:function(){
    return DOMstrings;
  },
  clearFields:function(){
    var fields = document.querySelectorAll(DOMstrings.inputDescription+ ","+ DOMstrings.inputValue);
    var fieldsArr = Array.prototype.slice.call(fields); 
   fieldsArr.forEach(function(el,index,array){
     el.value="";
   });
   fieldsArr[0].focus();
  },
  tusviigUzuuleh:function(tusuv){
    var type;
    if(tusuv.tusuv>0) type = "inc"
    else type="exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent= formatMoney(tusuv.tusuv, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc ,"inc");
      document.querySelector(DOMstrings.expenseLabel).textContent=formatMoney(tusuv.totalExp, "exp");
      if(tusuv.huvi!==0){
        document.querySelector(DOMstrings.percentageLabel).textContent= tusuv.huvi+"%";
      }else{
        document.querySelector(DOMstrings.percentageLabel).textContent= tusuv.huvi;
      }

  },
  deleteListItem:function(id){
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
  },
  addListItem: function(item,type){
    var html,list;
    if (type === "inc") {
      list = DOMstrings.incomeList;
      html =
        '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
    } else {
      list = DOMstrings.expenseList;
      html =
        '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
    }
    // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж
    html = html.replace("%id%", item.id);
    html = html.replace("$$DESCRIPTION$$", item.description);
    html = html.replace("$$VALUE$$", formatMoney(item.value,type) );
    //Бэлтгэсэн HTML-ээ  DOM руу хийж өгнө
    document.querySelector(list).insertAdjacentHTML("beforeend",html);
  }
};
})();

//Санхүүтэй ажиллах контроллер

var financeController=(function(){
  var Income = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  var Expense = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
  };
  Expense.prototype.calcPercentage= function(totalIncome){
    if(totalIncome>0)
    this.percentage= Math.round((this.value / totalIncome)*100);
    else this.percentage=0;
  };
  Expense.prototype.getPercentage=function(){
      return this.percentage;
  };
  var calculateTotal = function(type){
      var sum=0;
      data.items[type].forEach(function(el){
        sum=sum+el.value;
      });
      data.totals[type]=sum;
  }
  var data={
    items:{
      inc:[],
      exp:[]
    },
    totals:{
      inc:0,
      exp:0
    } ,
    tusuv:0,
    huvi:0
  };
  return {
    tusuvTootsooloh:function(){
      //нийт орлогын нийлбэр тооцоолоно
     calculateTotal("inc");
     //нийт зарлагын нийлбэр тооцоолоно
     calculateTotal("exp");
      // төсөвийг шинээр тооцоолох
     data.tusuv = data.totals.inc-data.totals.exp;
     //орлого зарлагын хувь тооцоолох
     if(data.totals.inc>0)
     data.huvi = Math.round((data.totals.exp/data.totals.inc)*100);
     else huvi=0;
    },
    calculatePercentages : function(){
        data.items.exp.forEach(function(el){
          el.calcPercentage(data.totals.inc);
        })
    },
    getPercentages : function(){
       var allPercentages=  data.items.exp.map(function(el){
         return  el.getPercentage();
        });
        return allPercentages;
    },
    tusviigAvah:function(){
      return {
        tusuv:data.tusuv,
        huvi:data.huvi,
        totalInc:data.totals.inc,
        totalExp:data.totals.exp
      }
    }, 
    deleteItem:function(type,id){
      var ids = data.items[type].map(function(el){
       return el.id;
      });
      var index = ids.indexOf(id);
      if(index !== -1){
        data.items[type].splice(index,1);
      }
    },
    addItem:function(type,desc,val){
      var item,id;
      if(data.items[type].length=== 0) {id=1;}
      else{
        id= data.items[type][data.items[type].length-1].id+1
      }
      if(type==="inc"){
        item=new Income(id,desc,val);
      }else{
        item=new Expense(id,desc,val);
      }
      data.items[type].push(item);
      return item;
    },
  }
})();

//Програмын холбогч контроллер 
var appController=(function(uiController,financeController){
 
  var ctrlAddItem = function(){
    //1. Оруулах өгөгдлийг дэлгэцээс олж авах.
    var input = uiController.getInput();
    if(input.description!=="" && input.value !==""){

      //2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэндээ хадгална.
      var item=  financeController.addItem(input.type,input.description,input.value);
      //3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох газар нь гаргана.
      uiController.addListItem(item,input.type);
      uiController.clearFields();
      //4. Төсвийг тооцоолно.
       updateTusuv();
    }
  };
  var updateTusuv= function(){
    financeController.tusuvTootsooloh();
    //5. Эцсийн үлдэгдэл
    var tusuv = financeController.tusviigAvah();
    //6. тооцоог дэлгэцэнд гаргана.
    uiController.tusviigUzuuleh(tusuv);
    //7. Элемэнтүүдийг хувийг тооцоолно
    financeController.calculatePercentages();
    //8. Элемэнтүүдийн хувийг хүлээж авна.
    var allPercentages = financeController.getPercentages();
    //9. Эдгээр хувийг дэлгэцэнд гаргана 
    uiController.displayPercentages(allPercentages);
   
  }
  var setupEventListeners=function(){
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click",function(){
      ctrlAddItem();
    });
    document.addEventListener("keypress",function(event){
      if(event.keyCode===13 || event.which===13){
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.inputType).addEventListener("change",uiController.changeType);
    document.querySelector(DOM.containerDiv).addEventListener("click",function(event){
      console.log(event.target.id);
      var id= event.target.parentNode.parentNode.parentNode.parentNode.id
      if(id){
        var arr= id.split("-");
      var type=arr[0];
      var itemId=parseInt(arr[1]);
      //1. Санхүүгийн модулаас type ,  id ашиглаад устгана.
      financeController.deleteItem(type,itemId);
      //2. Дэлгэц дээрээс энэ элемэнтийг устгана.
        uiController.deleteListItem(id);
      //3. Үлдэгдэл тооцоог шинэчилж харуулна.
        updateTusuv();
      }
    })
    
    
  };
  return {
    init:function(){
      console.log("app started .....");
      uiController.displayMonth();
      uiController.tusviigUzuuleh({
        tusuv:0,
        huvi:0,
        totalInc:0,
        totalExp:0
      })
      setupEventListeners();
    }
  }
  
})(uiController,financeController);
appController.init();
