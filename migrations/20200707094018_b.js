
exports.up = function(knex) {
   return knex
    .schema

    
.createTable( 'products', function( productTable ) { 
		productTable.engine('InnoDB');
		productTable.increments();  
		productTable.integer('cat_id').unsigned().nullable(); 
		productTable.integer('shop_id').unsigned().nullable(); 
		productTable.string( 'product_name', 30 ).nullable();      
		productTable.string( 'available', 30 ).nullable();      
		productTable.string( 'price', 30 ).nullable();      
		productTable.text( 'description' ).nullable();         
		productTable.text( 'tags' ).nullable();         
		productTable.integer( 'location' ).unsigned().nullable();  
		productTable.string( 'main_image', 70 ).nullable(); 
		productTable.string( 'first_image', 70 ).nullable(); 
		productTable.string( 'middle_image', 70 ).nullable(); 
		productTable.string( 'last_image', 70 ).nullable(); 
		productTable.string( 'first_delivery', 50 ).nullable();    
		productTable.string( 'second_delivery', 50 ).nullable();    
		productTable.string( 'third_delivery', 50 ).nullable(); 
		productTable.string( 'within_distance', 30 ).nullable();   
		productTable.string( 'within_charge', 30 ).nullable();     
		productTable.string( 'beyond_distance', 30 ).nullable();    
		productTable.string( 'beyond_charge', 30 ).nullable(); 
		productTable.enu('packed', ['PACKED', 'UNPACKED']).defaultTo('PACKED');
		productTable.enu('status', ['Active', 'Pending', 'Deleted']).defaultTo('Pending');    
		productTable.string('created_at',  50).nullable();
		productTable.string('updated_at',  50).nullable();
		productTable.foreign('cat_id').references('id').inTable('categories')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		productTable.foreign('shop_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		productTable.foreign('location').references('id').inTable('cities')
		.onDelete('CASCADE') .onUpdate('CASCADE');
})

// .createTable( 'bids', function( buyersTable ) { 
// 		buyersTable.engine('InnoDB'); 
// 		buyersTable.increments();
// 		buyersTable.integer('pid').unsigned().notNullable();  
// 		buyersTable.integer( 'buyer_id' ).unsigned().nullable(); 
// 		buyersTable.integer( 'seler_id' ).unsigned().nullable(); 
// 		buyersTable.string( 'rate', 10 ).nullable().defaultTo(0);   
// 		buyersTable.string( 'comment', 100 ).nullable(); 
// 		productTable.string( 'first_delivery', 50 ).nullable();    
// 		productTable.string( 'second_delivery', 50 ).nullable();    
// 		productTable.string( 'third_delivery', 50 ).nullable(); 
// 		productTable.string( 'within_distance', 30 ).nullable();   
// 		productTable.string( 'within_charge', 30 ).nullable();     
// 		productTable.string( 'beyond_distance', 30 ).nullable();    
// 		productTable.string( 'beyond_charge', 30 ).nullable();   
// 		buyersTable.string('created_at',  50).notNullable();
// 		buyersTable.foreign('pid').references('id').inTable('products')
// 		.onDelete('CASCADE') .onUpdate('CASCADE');
// 		buyersTable.foreign('bid').references('id').inTable('buyers')
// 		.onDelete('CASCADE') .onUpdate('CASCADE');
// 	})

	.createTable( 'ratings', function( ratingTable ) { 
		ratingTable.engine('InnoDB'); 
		ratingTable.increments();
		ratingTable.integer('pid').unsigned().notNullable();  
		ratingTable.integer( 'bid' ).unsigned().nullable(); 
		ratingTable.string( 'rate', 10 ).nullable().defaultTo(0);   
		ratingTable.string( 'comment', 100 ).nullable();   
		ratingTable.string('created_at',  50).notNullable();
		ratingTable.foreign('pid').references('id').inTable('products')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		ratingTable.foreign('bid').references('id').inTable('buyers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
	})


};

exports.down = function(knex) {
  
};
