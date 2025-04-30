
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

data = load_iris()
X, y = data.data, data.target

model = RandomForestClassifier()
model.fit(X, y)

dump(model, 'model.pkl')
