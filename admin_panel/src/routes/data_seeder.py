from flask import Blueprint, jsonify
from src.models.product import Product, db
from src.models.order import Order
from flask_cors import cross_origin

seeder_bp = Blueprint('seeder', __name__)

@seeder_bp.route('/seed-products', methods=['POST'])
@cross_origin()
def seed_products():
    """Seed the database with sample products"""
    try:
        # Check if products already exist
        if Product.query.count() > 0:
            return jsonify({'message': 'Products already exist in database'}), 200
        
        sample_products = [
            {
                'title': 'قالب موقع إلكتروني احترافي',
                'description': 'قالب HTML/CSS متجاوب ومتوافق مع جميع الأجهزة، مثالي للشركات والمؤسسات',
                'price': 29.99,
                'category': 'templates',
                'badge': 'الأكثر مبيعاً'
            },
            {
                'title': 'دورة تطوير المواقع الشاملة',
                'description': 'دورة كاملة لتعلم تطوير المواقع من الصفر حتى الاحتراف',
                'price': 99.99,
                'category': 'courses',
                'badge': 'جديد'
            },
            {
                'title': 'كتاب البرمجة للمبتدئين',
                'description': 'دليل شامل لتعلم البرمجة خطوة بخطوة مع أمثلة عملية',
                'price': 19.99,
                'category': 'ebooks',
                'badge': 'مميز'
            },
            {
                'title': 'برنامج إدارة المشاريع',
                'description': 'أداة قوية لإدارة المشاريع وتتبع المهام بكفاءة عالية',
                'price': 149.99,
                'category': 'software',
                'badge': 'احترافي'
            },
            {
                'title': 'مجموعة قوالب التصميم',
                'description': 'مجموعة من القوالب الجاهزة للتصميم والإعلانات',
                'price': 39.99,
                'category': 'templates',
                'badge': 'حزمة'
            },
            {
                'title': 'دورة التسويق الرقمي',
                'description': 'تعلم استراتيجيات التسويق الرقمي الحديثة والفعالة',
                'price': 79.99,
                'category': 'courses',
                'badge': 'محدث'
            },
            {
                'title': 'دليل ريادة الأعمال',
                'description': 'كتاب شامل عن كيفية بناء وإدارة الأعمال الناجحة',
                'price': 24.99,
                'category': 'ebooks',
                'badge': 'مفيد'
            },
            {
                'title': 'أداة تحليل البيانات',
                'description': 'برنامج متقدم لتحليل البيانات وإنشاء التقارير',
                'price': 199.99,
                'category': 'software',
                'badge': 'متقدم'
            }
        ]
        
        for product_data in sample_products:
            product = Product.from_dict(product_data)
            db.session.add(product)
        
        db.session.commit()
        
        return jsonify({'message': f'Successfully seeded {len(sample_products)} products'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@seeder_bp.route('/seed-orders', methods=['POST'])
@cross_origin()
def seed_orders():
    """Seed the database with sample orders"""
    try:
        # Check if orders already exist
        if Order.query.count() > 0:
            return jsonify({'message': 'Orders already exist in database'}), 200
        
        sample_orders = [
            {
                'products': [
                    {'id': 1, 'title': 'قالب موقع إلكتروني احترافي', 'price': 29.99, 'quantity': 1}
                ],
                'total_price': 29.99,
                'customer_name': 'أحمد محمد',
                'customer_whatsapp': '+966501234567',
                'status': 'completed'
            },
            {
                'products': [
                    {'id': 2, 'title': 'دورة تطوير المواقع الشاملة', 'price': 99.99, 'quantity': 1},
                    {'id': 3, 'title': 'كتاب البرمجة للمبتدئين', 'price': 19.99, 'quantity': 1}
                ],
                'total_price': 119.98,
                'customer_name': 'فاطمة علي',
                'customer_whatsapp': '+966507654321',
                'status': 'pending'
            },
            {
                'products': [
                    {'id': 4, 'title': 'برنامج إدارة المشاريع', 'price': 149.99, 'quantity': 1}
                ],
                'total_price': 149.99,
                'customer_name': 'محمد خالد',
                'customer_whatsapp': '+966509876543',
                'status': 'completed'
            }
        ]
        
        for order_data in sample_orders:
            order = Order.from_dict(order_data)
            db.session.add(order)
        
        db.session.commit()
        
        return jsonify({'message': f'Successfully seeded {len(sample_orders)} orders'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

