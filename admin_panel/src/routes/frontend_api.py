from flask import Blueprint, request, jsonify
from src.models.product import Product, db
from src.models.order import Order
from flask_cors import cross_origin

frontend_api_bp = Blueprint('frontend_api', __name__)

@frontend_api_bp.route('/frontend/products', methods=['GET'])
@cross_origin()
def get_frontend_products():
    """Get all products for frontend display"""
    try:
        products = Product.query.all()
        products_data = []
        
        for product in products:
            product_dict = product.to_dict()
            # Convert to frontend format
            frontend_product = {
                'id': product_dict['id'],
                'title': product_dict['title'],
                'description': product_dict['description'],
                'price': product_dict['price'],
                'category': product_dict['category'],
                'image': product_dict['image'],
                'badge': product_dict['badge']
            }
            products_data.append(frontend_product)
        
        return jsonify(products_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@frontend_api_bp.route('/frontend/products/<category>', methods=['GET'])
@cross_origin()
def get_products_by_category(category):
    """Get products by category for frontend"""
    try:
        if category == 'all':
            products = Product.query.all()
        else:
            products = Product.query.filter_by(category=category).all()
        
        products_data = []
        for product in products:
            product_dict = product.to_dict()
            frontend_product = {
                'id': product_dict['id'],
                'title': product_dict['title'],
                'description': product_dict['description'],
                'price': product_dict['price'],
                'category': product_dict['category'],
                'image': product_dict['image'],
                'badge': product_dict['badge']
            }
            products_data.append(frontend_product)
        
        return jsonify(products_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@frontend_api_bp.route('/frontend/orders', methods=['POST'])
@cross_origin()
def create_frontend_order():
    """Create a new order from frontend"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['products', 'total_price', 'customer_name', 'customer_whatsapp']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create order
        order = Order.from_dict(data)
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order created successfully',
            'order_id': order.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@frontend_api_bp.route('/frontend/product/<int:product_id>', methods=['GET'])
@cross_origin()
def get_single_product(product_id):
    """Get a single product for frontend"""
    try:
        product = Product.query.get_or_404(product_id)
        product_dict = product.to_dict()
        
        frontend_product = {
            'id': product_dict['id'],
            'title': product_dict['title'],
            'description': product_dict['description'],
            'price': product_dict['price'],
            'category': product_dict['category'],
            'image': product_dict['image'],
            'badge': product_dict['badge']
        }
        
        return jsonify(frontend_product), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@frontend_api_bp.route('/frontend/stats', methods=['GET'])
@cross_origin()
def get_frontend_stats():
    """Get basic stats for frontend display"""
    try:
        total_products = Product.query.count()
        total_orders = Order.query.count()
        completed_orders = Order.query.filter_by(status='completed').count()
        
        stats = {
            'total_products': total_products,
            'total_orders': total_orders,
            'completed_orders': completed_orders
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

