'use strict'; /* 厳格にエラーをチェック */

(async () => { /* ローカルスコープ */

// DOM取得
const tabMenus = document.querySelectorAll('.tab__menu-item');
const BUTTON_CLICK_EVENT= document.getElementById('test1');
const himitsuVersionSelect = document.getElementById('himitsu-version-select');
const verseVersionSelect = document.getElementById('verse-version-select');
const himitsuGetSelect = document.getElementById('himitsu-get-select');
const verseGetSelect = document.getElementById('verse-get-select');
const dispHimitsuItemList = document.getElementById('dispHimitsuItemList');
const dispVerseItemList = document.getElementById('dispVerseItemList');

// イベント付加
tabMenus.forEach((tabMenu) => {
  tabMenu.addEventListener('click', tabSwitch);
});

let himitsuItemList = [];
let verseItemList = [];

// JSON取得
await fetch("https://github.com/linaria0823/aipriComp/blob/main/json/himitsuItem.JSON")
.then(response => {
  return response.json();
})
.then(data => {
  himitsuItemList = data;
});

await fetch("https://github.com/linaria0823/aipriComp/blob/main/json/verseItem.JSON")
.then(response => {
  return response.json();
})
.then(data => {
  verseItemList = data;
});

// ciookieを削除
//document.cookie = "selectedHimitsuItemIds=; max-age=0";
//document.cookie = "selectedVerseItemIds=; max-age=0";

// 前回選択されたアイテムIDをCookieから取得
let savedHimitsuItemIds = getCookie('selectedHimitsuItemIds');
savedHimitsuItemIds = savedHimitsuItemIds ? JSON.parse(savedHimitsuItemIds) : [];
console.log(savedHimitsuItemIds);

let savedVerseItemIds = getCookie('selectedVerseItemIds');
savedVerseItemIds = savedVerseItemIds ? JSON.parse(savedVerseItemIds) : [];
console.log(savedVerseItemIds);

// 初回ひみつのアイプリリストセット
setItemList(himitsuItemList, "himitsu");
// 初回アイプリバースリストセット
setItemList(verseItemList, "verse");

// アイテムリストをセット
function setItemList(list, kind) {
  if (kind === "himitsu") {
    dispHimitsuItemList.innerHTML = ''; // ここでリストをクリア
  } else {
    dispVerseItemList.innerHTML = ''; // ここでリストをクリア
  }
  
  // データをfor文で追加
  list.forEach((product, index) => {
    const listItem = document.createElement('li'); // <li>を作成
    const button = document.createElement('button'); // <button>を作成
    button.className = 'noClick tooltip1 itemButton';
    button.onclick = () => handleItemClick(button, product.value, kind); // クリックイベント追加

    const description = document.createElement('div'); // <div>説明
    description.className = 'description1';
    description.textContent = product.name;

    const img = document.createElement('img'); // <img>画像
    if (kind === "himitsu") {
      img.className = 'cardItemImg';
    } else {
      img.className = 'itemImg';
    }
    img.src = product.src;

    // ボタンに説明と画像を追加
    button.appendChild(description);
    button.appendChild(img);

    // <li>にボタンを追加し、リストに追加
    listItem.appendChild(button);
    if (kind === "himitsu") {
      dispHimitsuItemList.appendChild(listItem);
    } else {
      dispVerseItemList.appendChild(listItem);
    }
    // Cookieに保存されているvalueの場合、isClickクラスを付与
    if (kind === "himitsu" && savedHimitsuItemIds.includes(product.value)) {
      button.classList.add('isClick');
    } else if (kind === "verse" && savedVerseItemIds.includes(product.value)) {
      button.classList.add('isClick');
    }
  });
}

// ひみつのアイプリのバージョンが変更された場合
himitsuVersionSelect.addEventListener('change', () => {
  let filteredResults = [];
  let filteredResults2 = [];
  // 各種選択された値を取得
  const selectedVersionValue = himitsuVersionSelect.value;
  const selectedGetValue = himitsuGetSelect.value;
  // 全弾選択時
  if (selectedVersionValue === "0") {
    if (selectedGetValue === "0") {
      // 全件取得
      setItemList(himitsuItemList, "himitsu");
    } else if (selectedGetValue === "1") {
      // 検索結果をフィルタリング(取得済み)
      savedHimitsuItemIds.forEach((tabItem) => {
        filteredResults.push(himitsuItemList.find(item => item.value === tabItem));
      });
      setItemList(filteredResults, "himitsu");
    } else {
      // 検索結果をフィルタリング(未取得)
      savedHimitsuItemIds.forEach((tabItem) => {
        filteredResults.push(himitsuItemList.find(item => item.value != tabItem));
      });
      setItemList(filteredResults, "himitsu");
    }
  } else {
    // 検索結果をフィルタリング(バージョン)
    filteredResults = himitsuItemList.filter(item => item.version === selectedVersionValue);
    if (selectedGetValue === "0") {
      // 全件取得
      setItemList(filteredResults, "himitsu");
    } else if (selectedGetValue === "1") {
      // 検索結果をフィルタリング(取得済み)
      savedHimitsuItemIds.forEach((tabItem) => {
        filteredResults2.push(filteredResults.find(item => item.value === tabItem));
      });
      setItemList(filteredResults2, "himitsu");
    } else {
      // 検索結果をフィルタリング(未取得)
      savedHimitsuItemIds.forEach((tabItem) => {
        filteredResults2.push(filteredResults.find(item => item.value != tabItem));
      });
      setItemList(filteredResults2, "himitsu");
    }
  }
});

// ひみつのアイプリの取得状況が変更された場合
himitsuGetSelect.addEventListener('change', () => {
  const selectedValue = himitsuVersionSelect.value; // 選択された値を取得
  // 全弾選択時
  if (selectedValue === "0") {
    // 結果を表示
    setItemList(himitsuItemList, "himitsu");
  } else {
    // 検索結果をフィルタリング
    const filteredResults = himitsuItemList.filter(item => item.version === selectedValue);
    // 結果を表示
    setItemList(filteredResults, "himitsu");
  }
});

// アイプリバースのバージョンが変更された場合
verseVersionSelect.addEventListener('change', () => {
  const selectedValue = verseVersionSelect.value; // 選択された値を取得
  // 全弾選択時
  if (selectedValue === "0") {
    // 結果を表示
    setItemList(verseItemList, "verse");
  } else {
    // 検索結果をフィルタリング
    const filteredResults = verseItemList.filter(item => item.version === selectedValue);
    // 結果を表示
    setItemList(filteredResults, "verse");
  }
});

// アイプリバースのバージョンが変更された場合
verseGetSelect.addEventListener('change', () => {
  const selectedValue = verseVersionSelect.value; // 選択された値を取得
  // 全弾選択時
  if (selectedValue === "0") {
    // 結果を表示
    setItemList(verseItemList, "verse");
  } else {
    // 検索結果をフィルタリング
    const filteredResults = verseItemList.filter(item => item.version === selectedValue);
    // 結果を表示
    setItemList(filteredResults, "verse");
  }
});

// イベントの処理
function tabSwitch(e) {
  // クリックされた要素のデータ属性を取得
  const tabTargetData = e.currentTarget.dataset.tab;
  // クリックされた要素の親要素と、その子要素を取得
  const tabList = e.currentTarget.closest('.tab__menu');
  const tabItems = tabList.querySelectorAll('.tab__menu-item');
  // クリックされた要素の親要素の兄弟要素の子要素を取得
  const tabPanelItems = tabList.nextElementSibling.querySelectorAll('.tab__panel-box');

  // クリックされたtabの同階層のmenuとpanelのクラスを削除
  tabItems.forEach((tabItem) => {
    tabItem.classList.remove('is-active');
  });
  tabPanelItems.forEach((tabPanelItem) => {
    tabPanelItem.classList.remove('is-show');
  });

  // クリックされたmenu要素にis-activeクラスを付加
  e.currentTarget.classList.add('is-active');
  // クリックしたmenuのデータ属性と等しい値を持つパネルにis-showクラスを付加
  tabPanelItems.forEach((tabPanelItem) => {
    if (tabPanelItem.dataset.panel === tabTargetData) {
      tabPanelItem.classList.add('is-show');
    }
  });
}

// クリックイベントの処理
function handleItemClick(button, value, kind) {
  let savedIds;
  if (kind === "himitsu") {
    savedIds = savedHimitsuItemIds;
  } else {
    savedIds = savedVerseItemIds;
  }
  const index = savedIds.findIndex((data) => data === value);
  if (index > -1) {
    console.log("選択されている");
    // すでに選択されている場合、配列から削除しクラスを外す
    savedIds.splice(index, 1);
    console.log(savedIds);
    button.classList.remove('isClick');
  } else {
    console.log("選択されていない");
    // 新規選択の場合、配列に追加しクラスを付与
    savedIds.push(value);
    console.log(savedIds);
    button.classList.add('isClick');
  }

  // Cookieに配列を保存
  if (kind === "himitsu") {
    setCookie('selectedHimitsuItemIds', JSON.stringify(savedIds)); // 保存期間なし
  } else {
    setCookie('selectedVerseItemIds', JSON.stringify(savedIds)); // 保存期間なし
  }
}

// Cookieの設定
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Cookieの取得
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

})();