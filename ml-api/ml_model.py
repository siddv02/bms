# Import libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, mean_squared_error
import os

# Setup
sns.set(style="whitegrid")
output_dir = r"C:\Users\siddv\fullstack-admin\client\src\assets\output"
os.makedirs(output_dir, exist_ok=True)

# Load data
df = pd.read_csv(r"C:\Users\siddv\OneDrive\Desktop\customer_transactions_dataset_with_cost.csv")

# Preprocess
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['hour'] = df['timestamp'].dt.hour
df['month'] = df['timestamp'].dt.to_period('M').dt.to_timestamp()

# Handle 'misc' subcategories explicitly
df['subcategory'] = df.apply(
    lambda x: x['subcategory'] if x['category'].lower() != 'misc' else x['subcategory'].lower().strip(), axis=1
)

# Label encode
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])
df['subcategory_encoded'] = le.fit_transform(df['subcategory'])

# Monthly sales aggregation
monthly_sales = df.groupby(['month', 'category']).agg({'price': 'sum'}).reset_index()
monthly_sales.rename(columns={'price': 'monthly_sales'}, inplace=True)

# Future months
future_months = pd.date_range(monthly_sales['month'].max(), periods=6, freq='M')[1:]

# One graph per category
for category in monthly_sales['category'].unique():
    cat_data = monthly_sales[monthly_sales['category'] == category].copy()
    cat_data = cat_data.sort_values('month')
    
    # Convert time to numerical feature
    cat_data['month_num'] = (cat_data['month'] - cat_data['month'].min()).dt.days
    X = cat_data[['month_num']]
    y = cat_data['monthly_sales']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict future
    future_month_nums = [(m - cat_data['month'].min()).days for m in future_months]
    future_preds = model.predict(np.array(future_month_nums).reshape(-1, 1))
    
    # Plot actual and predicted
    plt.figure(figsize=(10, 6))
    plt.plot(cat_data['month'], y, marker='o', label='Actual Sales', color='blue')
    plt.plot(future_months, future_preds, marker='o', linestyle='--', label='Predicted Sales', color='orange')
    plt.title(f'Sales Forecast - {category}')
    plt.xlabel('Month')
    plt.ylabel('Sales')
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"sales_forecast_{category.lower().replace(' ', '_')}.png"))
    plt.close()

### 1. Predict Product Future Sales
product_data = df.groupby(['subcategory', 'subcategory_encoded', 'category']).agg({
    'price': ['mean', 'sum', 'count'],
    'cost': 'mean',
    'category_encoded': 'first'
}).reset_index()
product_data.columns = ['subcategory', 'subcategory_encoded', 'category', 'price_mean', 'price_sum', 'price_count', 'cost_mean', 'category_encoded']

X_sales = product_data[['price_mean', 'cost_mean', 'category_encoded']]
y_sales = product_data['price_sum']

X_train, X_test, y_train, y_test = train_test_split(X_sales, y_sales, test_size=0.2, random_state=42)
sales_model = LinearRegression()
sales_model.fit(X_train, y_train)
product_data['predicted_sales'] = sales_model.predict(X_sales)

# Bar plot for predicted sales
plt.figure(figsize=(14, 8))
sorted_data = product_data.sort_values(by='predicted_sales', ascending=False).head(15)
sns.barplot(data=sorted_data, x='predicted_sales', y='subcategory', hue='category', dodge=False)
plt.title('Top Predicted Sales by Subcategory')
plt.xlabel('Predicted Sales')
plt.ylabel('Subcategory')
plt.legend(title='Category')
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "top_predicted_sales_by_subcategory.png"))
plt.show()

### 2. Classify Trending Products
threshold = product_data['price_count'].quantile(0.7)
product_data['is_trending'] = (product_data['price_count'] >= threshold).astype(int)

X_trend = product_data[['price_mean', 'cost_mean']]
y_trend = product_data['is_trending']

X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_trend, y_trend, test_size=0.2, random_state=42)
trend_model = RandomForestClassifier()
trend_model.fit(X_train_t, y_train_t)
product_data['predicted_trend'] = trend_model.predict(X_trend)

# Sunburst chart for trending products
trending_products = product_data[product_data['is_trending'] == 1].sort_values(by='price_count', ascending=False)
fig2 = px.sunburst(trending_products.head(15), path=['category', 'subcategory'], values='price_count',
                   title='Top Trending Products - Sunburst View')
fig2.write_image(os.path.join(output_dir, "top_trending_products_sunburst.png"))
fig2.show()

### 3. Cluster Similar Product Behaviors
scaler = StandardScaler()
X_cluster = scaler.fit_transform(product_data[['price_mean', 'cost_mean', 'price_count']])
kmeans = KMeans(n_clusters=3, random_state=42)
product_data['cluster'] = kmeans.fit_predict(X_cluster)

fig3 = px.scatter_3d(product_data, x='price_mean', y='cost_mean', z='price_count',
                     color='cluster', hover_name='subcategory', title='Product Clusters 3D View')
fig3.write_image(os.path.join(output_dir, "product_clusters_3d.png"))
fig3.show()

### 4. Predict Popular Categories
category_data = df.groupby('category_encoded').agg({
    'price': ['sum', 'count'],
    'cost': 'mean'
}).reset_index()
category_data.columns = ['category_encoded', 'price_sum', 'transaction_count', 'cost_mean']

popular_threshold = category_data['transaction_count'].quantile(0.75)
category_data['is_popular'] = (category_data['transaction_count'] >= popular_threshold).astype(int)

X_cat = category_data[['price_sum', 'cost_mean']]
y_cat = category_data['is_popular']

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_cat, y_cat, test_size=0.2, random_state=42)
category_model = RandomForestClassifier()
category_model.fit(X_train_c, y_train_c)

# Heatmap of predicted sales vs. trend
pivot = product_data.pivot_table(index='subcategory', columns='is_trending', values='predicted_sales', fill_value=0)
plt.figure(figsize=(12, 6))
sns.heatmap(pivot, annot=True, fmt=".1f", cmap="YlGnBu")
plt.title("Heatmap of Predicted Sales by Subcategory and Trending Status")
plt.ylabel("Subcategory")
plt.xlabel("Trending (0 = No, 1 = Yes)")
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "heatmap_predicted_sales_vs_trending.png"))
plt.show()
