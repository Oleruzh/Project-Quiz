// Объект с сохранёнными ответами.
let answers = {
  2: null,
  3: null,
  4: null,
  5: null,
};

// Движение вперёд
let btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    let thisCardNumber = parseInt(thisCard.dataset.card);

    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      updateProgressBar("next", thisCardNumber);
    } else {
      // При движении вперёд сохраняем данные в объект.
      saveAnswer(thisCardNumber, getCardData(thisCardNumber));

      // Валидация на заполненность.
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
      } else {
        alert("Сделайте ответ, прежде чем перейти далее!");
      }
    }
  });
});

// Движение назад.
let btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    let thisCardNumber = parseInt(thisCard.dataset.card);

    navigate("prev", thisCard);
    updateProgressBar("prev", thisCardNumber);
  });
});

// Функция для навигации, вперед и назад.
function navigate(direction, thisCard) {
  let thisCardnumber = parseInt(thisCard.dataset.card); // Определять номер текущей карточки
  let nextCard;

  if (direction == "next") {
    nextCard = thisCardnumber + 1;
  } else if (direction == "prev") {
    nextCard = thisCardnumber - 1;
  }
  thisCard.classList.add("hidden");
  document
    .querySelector(`[data-card="${nextCard}"]`)
    .classList.remove("hidden");
}

// Функция сбора заполненных данных с карточки.
function getCardData(number) {
  let question;
  let result = [];

  // находим карточку по номеру и дата-атрибуту.
  let currentCard = document.querySelector(`[data-card="${number}"]`);

  // находим главный вопрос карточки
  question = currentCard.querySelector("[data-question]").innerText;

  // находим все заполненные значения из радио-кнопок.
  let radioValues = currentCard.querySelectorAll('[type="radio"]');
  radioValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  // Находим значения по чек-боксам

  let chakBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
  chakBoxValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  // Находим значения по input

  let inputValues = currentCard.querySelectorAll(
    '[type="text"], [type="email"], [type="number"]'
  );
  inputValues.forEach(function (item) {
    itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let data = {
    question: question,
    answer: result,
  };
  return data;
}

// Функция записи ответа в объект с ответами.
function saveAnswer(number, data) {
  answers[number] = data;
}

// Функция проверки на заполненность.
function isFilled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Ф-я для проверки email.
function validateEmail(email) {
  let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

// Проверка на заполненность required, чек боксов и инпутов с email.
function checkOnRequired(number) {
  let currentCard = document.querySelector(`[data-card="${number}"]`);
  let requiredFields = currentCard.querySelectorAll("[required]");
  let isValidArray = [];

  requiredFields.forEach(function (item) {
    if (item.type == "checkbox" && item.checked == false) {
      isValidArray.push(false);
    } else if (item.type == "email") {
      if (validateEmail(item.value)) {
        isValidArray.push(true);
      } else {
        isValidArray.push(false);
      }
    }
  });

  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return false;
  }
}

// Подсвечиваем рамку у радиокнопок.
document.querySelectorAll(".radio-group").forEach(function (item) {
  item.addEventListener("click", function (event) {
    // Проверяем где произошел клик - внутри тега label или нет.
    let label = event.target.closest("label");
    if (label) {
      // отменяем активный класс у всех тегов label
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach(function (item) {
          item.classList.remove("radio-block--active");
        });
      //Добавляем активный класс к label по которому был клик.
      label.classList.add("radio-block--active");
    }
  });
});

// Подсвечиваем рамку у чекбокса.
document
  .querySelectorAll('label.checkbox-block input[type="checkbox"]')
  .forEach(function (item) {
    item.addEventListener("change", function () {
      // Если чекбокс проставлен то
      if (item.checked) {
        item.closest("label").classList.add("checkbox-block--active");
      } else {
        item.closest("label").classList.remove("checkbox-block--active");
      }
    });
  });

// Отображение прогресс бара.
function updateProgressBar(direction, cardNumber) {
  // Расчет всего кол-ва карточек
  let cardsTotalNumber = document.querySelectorAll("[data-card]").length;

  // Текущая карточка. Проверка перемещения направления
  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }
  // Расчет % прохождения
  let progress = ((cardNumber * 100) / cardsTotalNumber).toFixed(); // Убираем дроби до целого числа;

  // Обновляем прогресс-бар
  let progressBar = document
    .querySelector(`[data-card = "${cardNumber}"]`)
    .querySelector(".progress");
  if (progressBar) {
    // Обновить число прогресс бара
    progressBar.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    // Обновить полоску бара
    progressBar.querySelector(
      ".progress__line-bar"
    ).style = `width: ${progress}%`;
  }
}
