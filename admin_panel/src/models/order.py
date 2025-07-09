from src.models.user import db
from datetime import datetime
import json

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    products_json = db.Column(db.Text, nullable=False)  # JSON string of products
    total_price = db.Column(db.Float, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_whatsapp = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def products(self):
        """Get products as Python list"""
        return json.loads(self.products_json) if self.products_json else []
    
    @products.setter
    def products(self, value):
        """Set products from Python list"""
        self.products_json = json.dumps(value)
    
    def to_dict(self):
        return {
            'id': self.id,
            'products': self.products,
            'total_price': self.total_price,
            'customer_name': self.customer_name,
            'customer_whatsapp': self.customer_whatsapp,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def from_dict(data):
        order = Order(
            total_price=data.get('total_price'),
            customer_name=data.get('customer_name'),
            customer_whatsapp=data.get('customer_whatsapp'),
            status=data.get('status', 'pending')
        )
        order.products = data.get('products', [])
        return order

