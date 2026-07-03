# Binbin Lin Academic Homepage

这是一个适合 GitHub Pages 的严肃学术主页版本，主色调为 maroon，支持中英文切换。中文内容按中国高校教师主页习惯重新组织，英文内容按国际学术主页习惯组织；论文、会议论文、专著条目保留英文。

## 如何更新内容

主要更新 `data/site.json`：

- `profile`：姓名、职称、单位、邮箱、研究关键词、个人简介
- `sections.about`：教师简介/英文 Profile
- `sections.education`：教育经历与工作经历
- `sections.research`：研究方向
- `sections.publications`：论文论著，可分 Journal Articles / Conference Papers / Book Chapters
- `sections.projects`：科研项目
- `sections.teaching`：教学工作
- `sections.awards`：获奖情况
- `sections.students`：研究生培养
- `sections.patents`：专利与软著
- `sections.talks`：学术报告与会议
- `sections.service`：学术服务

## 如何替换照片

把个人照片放到 `img/` 文件夹，比如命名为：

`profile.jpg`

然后打开 `data/site.json`，把：

```json
"photo": "img/profile-placeholder.svg"
```

改成：

```json
"photo": "img/profile.jpg"
```

## 如何替换顶部横幅图

替换 `img/banner-digital-earth.svg`，或在 `index.html` 中把 banner 图片路径改成自己的图片。

建议横幅比例：宽图，约 1600 × 360 或 1800 × 400。
