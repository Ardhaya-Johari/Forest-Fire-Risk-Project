<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=34&pause=1000&color=FF4500&center=true&vCenter=true&width=1000&height=90&lines=Forest+Fire+Risk;Exploratory+Data+Analysis;Week+1+%26+2+Project" alt="Typing Banner"/>
</p>


<div align="center">

![Project](https://img.shields.io/badge/Project-Forest%20Fire%20Risk-blue?style=for-the-badge)
![Week2](https://img.shields.io/badge/Week-1%20%26%202-yellow?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9-blue?style=for-the-badge&logo=python)
![Pandas](https://img.shields.io/badge/Library-Pandas-orange?style=for-the-badge&logo=pandas)
![Seaborn](https://img.shields.io/badge/Library-Seaborn-lightblue?style=for-the-badge&logo=seaborn)

</div>

---

# 🌲🔥 Forest Fires — Climate Risk & Disaster Management (Week 1 & 2)

## 📌 Project Summary
This repository is part of the **AICTE / Edunet Foundation** internship *Climate Risk & Disaster Management*.  
We analyze the **Forest Fires** dataset to explore how weather, time, and location affect wildfire occurrence and burned area. The work covers **Week 1 (initial EDA)** and **Week 2 (deeper EDA, data transformation, feature selection)**.

---

## 📂 Repository Contents
- `forestfires.csv` — original dataset (Kaggle).  
- `forest_fire_week1_and_2.ipynb` — combined Week 1 + Week 2 notebook (EDA, transformations, feature selection).  
- `README.md` — this file.  

---

## 📊 Dataset at a glance
- **Rows:** 517  
- **Columns:** 13  
- **Key features:** `X`, `Y`, `month`, `day`, `FFMC`, `DMC`, `DC`, `ISI`, `temp`, `RH`, `wind`, `rain`, `area`  
- **Target:** `area` (burned area in hectares) — highly right-skewed

---

## 🗂️ Week 1 — Initial Exploration
- Loaded dataset and inspected structure (`.info()`, `.describe()`).  
- Confirmed there are **no missing values**.  
- Observed that `area` is **highly skewed** with most values near 0 and a few large outliers.

**Quick takeaway:** dataset is clean but imbalanced — log transform is recommended before analysis.

---

## 🔎 Week 2 — EDA, Data Transformation & Feature Selection

### What I implemented
- **Target analysis**
  - Plotted `area` histogram and applied `log1p(area)` → `area_log`.
- **Categorical analysis**
  - Countplots for `month` and `day`, and mean `area_log` by month/day.
- **Numerical relationships**
  - Correlation heatmap for numeric features.
  - Scatterplots of `temp`, `RH`, `wind`, `ISI`, `rain` vs `area_log`.
- **Spatial analysis**
  - Scatter plot of `X` vs `Y` with point sizes scaled by `area_log`.
- **Outlier detection**
  - Top-10 largest fires table and IQR-based outlier detection on `area_log`.
- **Feature preparation & selection**
  - One-hot encoded `month` and `day`.
  - Computed **Mutual Information** (MI) with `area_log` for nonlinear importance.
  - Computed basic correlations with `area_log`.
- **(Optional)** Simple linear regression 5-fold CV using top MI features (sanity check).

---

## 📈 Key Observations (short)
- `area` is **right-skewed**; `log1p(area)` provides a more usable target.  
- Fire activity concentrates in **summer months (July–September)**; **August** often shows the highest mean burned area.  
- **Fire weather indices (FFMC, DMC, DC, ISI)** are among the most informative features.  
- **Temperature** shows a weak positive correlation; **relative humidity** tends to be negatively correlated.  
- A few **very large fires** act as outliers and can dominate aggregate statistics.

---

## ⚙️ How to run (recommended)
1. Create & activate a virtual environment:
   ```bash
   python -m venv venv
   # mac/linux
   source venv/bin/activate
   # windows (cmd)
   venv\Scripts\activate
   ```

2.Install dependencies:
```bash
pip install pandas numpy matplotlib seaborn scikit-learn notebook
```

3.Start Jupyter:
```bash
jupyter notebook
```

## 🙌 Acknowledgments

- AICTE & Edunet Foundation — internship & mentoring sessions.

- Kaggle — dataset source.

