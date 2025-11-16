![icon](https://github.com/ARTEMIY-FCC/zeppos-russian-keyboard/blob/main/assets/default.r/icon.png?raw=true)
# Русская клавиатура для Zepp OS (API 4.2)
![screens](https://github.com/ARTEMIY-FCC/zeppos-russian-keyboard/blob/main/screenshots/s.png?raw=true)
![screenr](https://github.com/ARTEMIY-FCC/zeppos-russian-keyboard/blob/main/screenshots/r.PNG?raw=true)

Кастомная русская клавиатура для часов на платформе **Zepp OS**. Работает с **API 4.2** и интегрируется в системные поля ввода (ответы на сообщения и т.п.). В проект добавлены скриншоты интерфейса и иконка приложения.

# Особенности
- Поддержка ввода на русском языке.  
- Подсказки типа Т9, формируются из мини-словаря проекта — **~120 слов**.  

# Быстрая установка исходников
Откройте терминал и выполните:

```bash
git clone https://github.com/ARTEMIY-FCC/zeppos-russian-keyboard.git
cd zeppos-russian-keyboard
````

Далее установите `zeus` CLI согласно официальной инструкции:
[https://docs.zepp.com/docs/guides/tools/cli/](https://docs.zepp.com/docs/guides/tools/cli/)

После установки `zeus` выполните подготовку файла (распаковка node_modules):

```bash
python3 preapre_all.py
```

# Сборка и установка на устройство

1. Для установки пакета на устройство можно воспользоваться QR с 4PDA:
   [https://4pda.to/forum/index.php?showtopic=1052827&st=4240#entry140243476](https://4pda.to/forum/index.php?showtopic=1052827&st=4240#entry140243476)
2. Если вы редактируете код под себя, для установки на устройство используем команду
```bash
zeus preview
```

# Благодарности

Спасибо автору `silver-zepp` — образцу, на который опирался этот проект:
[https://github.com/silver-zepp/zeppos-samples/tree/main/application/4.2/simple-keyboard](https://github.com/silver-zepp/zeppos-samples/tree/main/application/4.2/simple-keyboard)

# Контакты

* Email: `artemiy0216@icloud.com`
* Telegram: [https://t.me/stukarchuk](https://t.me/stukarchuk)

# Поддержать

Если хотите поддержать развитие проекта:
[https://www.donationalerts.com/r/artmix_cuber07](https://www.donationalerts.com/r/artmix_cuber07)
