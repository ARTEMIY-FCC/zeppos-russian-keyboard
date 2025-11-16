# zeppos-russian-keyboard
# Русская клавиатура для Zepp OS (API 4.2)

**Кратко:** кастомная русская клавиатура для часов на платформе **Zepp OS**. Работает с **API 4.2** и интегрируется в системные поля ввода (ответы на сообщения и т.п.). В проект добавлены скриншоты интерфейса и иконка приложения.

# Особенности
- Поддержка ввода на русском языке в системных полях Zepp OS.  
- Подсказки / кандидаты набора (T9-подобное поведение) формируются из мини-словаря проекта — **~120 слов**.  
- Оптимизация под круглые и прямоугольные экраны часов.  
- Основано на примере `simple-keyboard` от `silver-zepp`.

# Быстрая установка исходников
Откройте терминал и выполните:

```bash
git clone https://github.com/ARTEMIY-FCC/zeppos-russian-keyboard.git
cd zeppos-russian-keyboard
````

Далее установите и настройте `zeus` CLI согласно официальной инструкции:
[https://docs.zepp.com/docs/guides/tools/cli/](https://docs.zepp.com/docs/guides/tools/cli/)

После установки `zeus` выполните подготовку зависимостей (распаковка node_modules):

```bash
python3 preapre_all.py
```

# Сборка и установка на устройство

1. Убедитесь, что `zeus` настроен и авторизован на вашей машине.
2. Выполните стандартные команды `zeus` для сборки/пакета (например `zeus build` / `zeus package`) — см. документацию `zeus`.
3. Для установки пакета на устройство можно воспользоваться QR/инструкцией — пример установки и QR-ссылка приводится на 4PDA:
   [https://4pda.to/forum/index.php?showtopic=1052827&st=4240#entry140243476](https://4pda.to/forum/index.php?showtopic=1052827&st=4240#entry140243476)

> Примечание: конкретные команды и шаги зависят от версии `zeus` и настроек вашей среды — используйте официальную документацию.

# Благодарности

Спасибо автору `silver-zepp` — образцу, на который опирался этот проект:
[https://github.com/silver-zepp/zeppos-samples/tree/main/application/4.2/simple-keyboard](https://github.com/silver-zepp/zeppos-samples/tree/main/application/4.2/simple-keyboard)

# Контакты

* Email: `artemiy0216@icloud.com`
* Telegram: [https://t.me/stukarchuk](https://t.me/stukarchuk)

# Поддержать

Если хотите поддержать развитие проекта:
[https://www.donationalerts.com/r/artmix_cuber07](https://www.donationalerts.com/r/artmix_cuber07)
